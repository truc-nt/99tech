import sqlite3 from "sqlite3";
import path from "path";

/**
 * Interface defining database operations.
 */
export interface IDatabase {
  /**
   * Get the active SQLite database instance.
   * @returns sqlite3.Database instance
   */
  getDb(): sqlite3.Database;

  /**
   * Close the database connection gracefully.
   * @returns Promise that resolves when the connection is closed
   */
  close(): Promise<void>;
}

/**
 * SQLite Database wrapper.
 * Handles connection initialization, table creation, and closure.
 */
export default class Database implements IDatabase {
  private db: sqlite3.Database;

  constructor() {
    // Resolve path to SQLite file relative to current directory
    const dbPath = path.join(__dirname, "../../database.sqlite");

    // Initialize SQLite connection
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
        throw err;
      } else {
        console.log("Connected to SQLite database");
        this.initializeTables();
      }
    });
  }

  /**
   * Get the active database instance.
   * @returns sqlite3.Database
   */
  public getDb(): sqlite3.Database {
    return this.db;
  }

  /**
   * Creates required tables if they don't exist.
   * Currently initializes the 'resources' table.
   */
  private initializeTables(): void {
    const createResourcesTable = `
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createResourcesTable, (err) => {
      if (err) {
        console.error("Error creating resources table:", err.message);
      }
    });
  }

  /**
   * Close the database connection gracefully.
   * @returns Promise<void>
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error("Error closing database:", err.message);
          reject(err);
        } else {
          console.log("Database connection closed");
          resolve();
        }
      });
    });
  }
}
