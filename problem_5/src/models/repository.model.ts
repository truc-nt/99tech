/**
 * Supported column data types:
 * - "string"
 * - "number"
 * - "date"
 */
export type ColumnType = "string" | "number" | "date";

/**
 * Describes a table structure:
 * - tableName: Name of the table
 * - columnTypes: Mapping of column names to their data types
 */
export type TableDescriptor = {
  tableName: string;
  columnTypes: Record<string, ColumnType>;
};

/**
 * Standardized query/filter parameters used by controllers/services
 *
 * Properties:
 * - limit?: Maximum number of results to return
 * - offset?: Starting index for pagination
 * - sort?: Sorting options (array of { name, order })
 * - other?: Additional filters (key-value pairs)
 */
export type FilterParam = {
  limit?: number;
  offset?: number;
  sort?: {
    name: string;
    order: "asc" | "desc";
  }[];
  other?: Record<string, string | string[]>;
};
