import { TableDescriptor, ColumnType } from "../models/repository.model";
import { IDatabase } from "../db/sqlite";

/**
 * Base repository providing common SQL query builders
 * and type-safe coercion of values for table columns.
 */
export class BaseRepository {
  /** Table name for the repository */
  protected tableName!: string;

  /**
   * @param database Database connection instance
   */
  constructor(protected readonly database: IDatabase) {}

  /**
   * Resolve the table and type of a given column key across multiple tables.
   *
   * @param tables List of table descriptors to search
   * @param key Column key to resolve
   * @returns Object with table name and column type, or null if not found
   */
  private resolveColumn(
    tables: TableDescriptor[],
    key: string,
  ): { table: string; type: ColumnType } | null {
    for (const table of tables) {
      const type = table.columnTypes[key];
      if (type) return { table: table.tableName, type };
    }
    return null;
  }

  /**
   * Convert a string value to the proper type for a column.
   *
   * @param value Value as string
   * @param type Column type
   * @returns Coerced value
   */
  private coerceValue(value: string, type: ColumnType): any {
    switch (type) {
      case "number":
        return Number(value);
      case "date":
        // Accepts "YYYY-MM-DD HH:MM:SS" format as-is
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
          return value;
        }
        // Converts "YYYY-MM-DD" to "YYYY-MM-DD 00:00:00"
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return `${value} 00:00:00`;
        }
        return "";
      default:
        return value;
    }
  }

  /**
   * Coerce an array of string values to their proper column type.
   *
   * @param values Array of string values
   * @param type Column type
   * @returns Array of coerced values
   */
  private coerceArray(values: string[], type: ColumnType): any[] {
    return values.map((v) => this.coerceValue(v, type));
  }

  /**
   * Build a WHERE clause and corresponding parameter values
   * from filter key-value pairs and allowed columns.
   *
   * @param tables Tables to reference for column types
   * @param filter Key-value pairs for filtering
   * @param validColumnNames Optional list of allowed columns
   * @returns Object with SQL clause and parameter array
   */
  buildWhereClause(
    tables: TableDescriptor[],
    filter?: Record<string, string | string[]>,
    validColumnNames?: string[],
  ): { clause: string; params: any[] } {
    if (!filter) {
      return { clause: "", params: [] };
    }
    const conditions: string[] = [];
    const params: any[] = [];

    for (const [key, rawValue] of Object.entries(filter)) {
      const resolved = this.resolveColumn(tables, key);
      if (!resolved) continue;

      const { table, type } = resolved;

      // Skip columns that are not in the allowed list
      if (validColumnNames && !validColumnNames.includes(key)) continue;

      const columnRef = `${table}.${key}`;

      if (Array.isArray(rawValue)) {
        // Build placeholders for multiple values in an IN clause
        const placeholders = rawValue.map(() => "?").join(", ");
        conditions.push(`${columnRef} IN (${placeholders})`);
        params.push(...this.coerceArray(rawValue, type));
      } else {
        conditions.push(`${columnRef} = ?`);
        params.push(this.coerceValue(rawValue, type));
      }
    }

    const clause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { clause, params };
  }

  /**
   * Build an ORDER BY clause from sort specifications.
   *
   * @param sort Array of objects { name, order }
   * @returns SQL ORDER BY clause or empty string
   */
  buildOrderByClause(sort?: { name: string; order: string }[]): string {
    if (!sort || sort.length === 0) return "";
    // Converts to SQL format: "column_name ASC/DESC"
    const clause = sort.map(({ name, order }) => `${name} ${order.toUpperCase()}`).join(", ");
    return `ORDER BY ${clause}`;
  }

  /**
   * Build LIMIT and OFFSET clause for pagination.
   *
   * @param limit Maximum number of rows
   * @param offset Starting row index
   * @returns SQL LIMIT/OFFSET clause or empty string
   */
  buildLimitOffsetClause(limit?: number, offset?: number): string {
    const clauses: string[] = [];
    if (typeof limit === "number") clauses.push(`LIMIT ${limit}`);
    if (typeof offset === "number") clauses.push(`OFFSET ${offset}`);
    return clauses.join(" ");
  }

  /**
   * Build an INSERT SQL query and corresponding parameter values.
   * Supports inserting a single row or multiple rows.
   *
   * @param columnTypes Column types of the table
   * @param data Object or array of objects representing row data
   * @returns Object containing query string and array of values
   */
  buildInsertQuery(
    columnTypes: Record<string, ColumnType>,
    data: Record<string, any> | Record<string, any>[],
  ): { query: string; values: any[] } {
    const rows = Array.isArray(data) ? data : [data];

    // Collect all keys that have non-null values
    const allKeys = new Set<string>();
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        const value = row[key];
        if (value !== null && value !== undefined) {
          allKeys.add(key);
        }
      }
    }

    const columns = Array.from(allKeys);
    if (columns.length === 0) {
      throw new Error("No valid fields to insert.");
    }

    // Coerce values for each row to the proper column type
    const valueMatrix: any[][] = rows.map((row) =>
      columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) return null;
        const type = columnTypes[col];
        return this.coerceValue(String(value), type);
      }),
    );

    // Build placeholders for multiple rows
    const placeholders = valueMatrix.map((row) => `(${row.map(() => "?").join(", ")})`).join(", ");
    const query = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES ${placeholders}`;
    const values = valueMatrix.flat();

    return { query, values };
  }

  /**
   * Build an UPDATE SQL clause and parameter values from data.
   *
   * @param columnTypes Column types of the table
   * @param data Object representing fields to update
   * @returns Object containing SQL query and parameter values
   */
  buildUpdateClause(
    columnTypes: Record<string, ColumnType>,
    data: Record<string, any>,
  ): { query: string; values: any[] } {
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const [key, raw] of Object.entries(data)) {
      if (raw === null || raw === undefined) continue;

      const type = columnTypes[key];
      const value = this.coerceValue(String(raw), type);

      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    if (setClauses.length === 0) {
      throw new Error("No valid fields to update.");
    }

    if ("updatedAt" in columnTypes) {
      setClauses.push(`updatedAt = CURRENT_TIMESTAMP`);
    }

    const sql = `UPDATE ${this.tableName} SET ${setClauses.join(", ")}`;
    return { query: sql, values: values };
  }
}
