import { Resource, ResourceTableDescriptor } from "../models/resource.model";
import { IDatabase } from "../db/sqlite";
import { CreateResourceDto, UpdateResourceDto } from "../models/resource.schema";
import { FilterParam } from "../models/repository.model";
import { BaseRepository } from "./base.repository";

/**
 * Interface for Resource repository operations
 */
export interface IResourceRepository {
  /**
   * Retrieve multiple resources with filters, pagination, and sorting.
   * @param filter Filter parameters (limit, offset, sort, other)
   */
  findMany(filter: FilterParam): Promise<Resource[]>;

  /**
   * Retrieve a single resource by its ID.
   * @param id Resource ID
   */
  findOne(id: number): Promise<Resource | undefined>;

  /**
   * Create a new resource.
   * @param newData Data for the new resource
   */
  create(newData: CreateResourceDto): Promise<Resource | undefined>;

  /**
   * Update an existing resource.
   * @param id Resource ID to update
   * @param updatedData Updated values
   */
  update(id: number, updatedData: UpdateResourceDto): Promise<Resource | undefined>;

  /**
   * Delete a resource by ID.
   * @param id Resource ID to delete
   */
  delete(id: number): Promise<boolean>;
}

/**
 * Repository for managing Resource entities in the database.
 */
export default class ResourceRepository extends BaseRepository implements IResourceRepository {
  constructor(database: IDatabase) {
    super(database);
    this.tableName = "resources";
  }

  /**
   * Retrieve multiple resources matching the filter.
   *
   * @param filter Object containing filter parameters:
   * @param other: key-value pairs for WHERE clause
   * @param sort: array of column/order objects for ORDER BY
   * @param limit: max number of rows
   * @param offset: start index for pagination
   * @returns Array of resources matching the filter
   */
  public async findMany(filter: FilterParam): Promise<Resource[]> {
    return new Promise((resolve, reject) => {
      const whereClause = this.buildWhereClause([ResourceTableDescriptor], filter.other);
      const orderByClause = this.buildOrderByClause(filter.sort);
      const limitOffsetClause = this.buildLimitOffsetClause(filter.limit, filter.offset);

      const query = `SELECT * FROM ${this.tableName} ${whereClause.clause} ${orderByClause} ${limitOffsetClause}`;
      const params = whereClause.params || [];

      this.database.getDb().all(query, params, (err: Error | null, rows: Resource[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  /**
   * Retrieve a single resource by its ID.
   *
   * @param id Resource ID to fetch
   * @returns Resource if found, undefined otherwise
   */
  public async findOne(id: number): Promise<Resource | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.database
        .getDb()
        .get(query, [id], function (err: Error | null, row: Resource | undefined) {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        });
    });
  }

  /**
   * Create a new resource.
   *
   * @param newData Data for the new resource
   * @returns Newly created resource
   *
   * Note: Uses SQLite's `this.lastID` to get the inserted row ID
   */
  public async create(newData: CreateResourceDto): Promise<Resource | undefined> {
    return new Promise((resolve, reject) => {
      const self = this;

      const insertQuery = this.buildInsertQuery(ResourceTableDescriptor.columnTypes, newData);

      this.database
        .getDb()
        .run(insertQuery.query, insertQuery.values, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }

          // `this.lastID` comes from SQLite statement object
          self.findOne(this.lastID).then(resolve).catch(reject);
        });
    });
  }

  /**
   * Update an existing resource by ID.
   *
   * @param id Resource ID to update
   * @param updatedData Updated values for the resource
   * @returns Updated resource or undefined if not found
   */
  public async update(id: number, updatedData: UpdateResourceDto): Promise<Resource | undefined> {
    return new Promise((resolve, reject) => {
      const self = this;

      const updateClause = this.buildUpdateClause(ResourceTableDescriptor.columnTypes, updatedData);
      const whereClause = this.buildWhereClause([ResourceTableDescriptor], { id: String(id) });

      if (!updateClause || !whereClause) {
        reject(new Error("Invalid update or where clause"));
        return;
      }

      const query = `${updateClause.query} ${whereClause.clause}`;
      const values = [...updateClause.values, ...whereClause.params];

      this.database.getDb().run(query, values, function (err: Error | null) {
        if (err) {
          reject(err);
          return;
        }

        // Return the updated resource
        self.findOne(id).then(resolve).catch(reject);
      });
    });
  }

  /**
   * Delete a resource by ID.
   *
   * @param id Resource ID to delete
   * @returns True if a row was deleted, false otherwise
   *
   * Note: Uses SQLite's `this.changes` to check deletion count
   */
  public async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.database
        .getDb()
        .run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }

          // `this.changes` > 0 means at least one row was deleted
          resolve(this.changes > 0);
        });
    });
  }
}
