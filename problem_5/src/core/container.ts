// Import application modules for dependency setup
import Database from "../db/sqlite";
import ResourceRepository from "../repositories/resource.repository";
import ResourceService from "../services/resource.service";
import ResourceController from "../controllers/resource.controller";

/**
 * Singleton Dependency Injection Container
 * Allows registering and resolving application-wide dependencies.
 */
export class DIContainer {
  private static instance: DIContainer;
  private readonly dependencies = new Map<string, any>();

  /** Private constructor to enforce singleton pattern */
  private constructor() {}

  /**
   * Get the singleton instance of the DIContainer.
   * @returns DIContainer instance
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Register a dependency instance with a unique key.
   * @param key Unique key for the dependency
   * @param instance Dependency instance to store
   */
  public register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }

  /**
   * Resolve a dependency by its key.
   * @param key Unique key of the dependency
   * @returns The requested dependency instance
   * @throws Error if dependency is not found
   */
  public resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`);
    }
    return dependency as T;
  }

  /**
   * Clear all registered dependencies.
   */
  public clear(): void {
    this.dependencies.clear();
  }
}

/**
 * Set up and register all core application dependencies
 * into the DIContainer singleton.
 */
export function setUpDependencies(): void {
  const container = DIContainer.getInstance();

  // Create instances of core services
  const database = new Database();
  const resourceRepository = new ResourceRepository(database);
  const resourceService = new ResourceService(resourceRepository);
  const resourceController = new ResourceController(resourceService);

  // Register instances with DIContainer
  container.register("Database", database);
  container.register("ResourceRepository", resourceRepository);
  container.register("ResourceService", resourceService);
  container.register("ResourceController", resourceController);

  console.log("Dependencies configured successfully");
}
