import { Resource, ResourceStatus } from "../models/resource.model";
import { FilterParam } from "../models/repository.model";
import { CreateResourceDto, UpdateResourceDto } from "../models/resource.schema";
import { IResourceRepository } from "../repositories/resource.repository";

/**
 * Interface for Resource service operations.
 */
export interface IResourceService {
  /**
   * Get multiple resources with filters, pagination, and sorting.
   * @param filter Filter parameters (limit, offset, sort, other)
   * @returns Array of resources
   */
  getResources(filter: FilterParam): Promise<Resource[]>;

  /**
   * Get a single resource by ID.
   * @param id Resource ID
   * @returns Resource if found, undefined otherwise
   */
  getResource(id: number): Promise<Resource | undefined>;

  /**
   * Create a new resource.
   * @param newData Data for the new resource
   * @returns Newly created resource
   */
  createResource(newData: CreateResourceDto): Promise<Resource | undefined>;

  /**
   * Update an existing resource by ID.
   * @param id Resource ID to update
   * @param updatedData Updated values for the resource
   * @returns Updated resource if successful, undefined if not found
   */
  updateResource(id: number, updatedData: UpdateResourceDto): Promise<Resource | undefined>;

  /**
   * Delete a resource by ID.
   * @param id Resource ID to delete
   * @returns True if deletion succeeded, false otherwise
   */
  deleteResource(id: number): Promise<boolean>;
}

/**
 * Service layer for managing Resources.
 * Delegates CRUD operations to the Resource repository.
 */
export default class ResourceService implements IResourceService {
  constructor(private readonly resourceRepository: IResourceRepository) {}

  /**
   * Retrieve multiple resources.
   * @param filter Filter parameters
   * @returns Array of resources matching filter
   */
  public async getResources(filter: FilterParam): Promise<Resource[]> {
    return this.resourceRepository.findMany(filter);
  }

  /**
   * Retrieve a single resource by ID.
   * @param id Resource ID
   * @returns Resource if found, undefined otherwise
   */
  public async getResource(id: number): Promise<Resource | undefined> {
    return this.resourceRepository.findOne(id);
  }

  /**
   * Create a new resource.
   * @param newData Resource creation data
   * @returns Newly created resource
   */
  public async createResource(newData: CreateResourceDto): Promise<Resource | undefined> {
    return this.resourceRepository.create(newData);
  }

  /**
   * Update a resource by ID.
   * @param id Resource ID
   * @param updateData Updated resource data
   * @returns Updated resource if successful
   */
  public async updateResource(
    id: number,
    updateData: UpdateResourceDto,
  ): Promise<Resource | undefined> {
    return this.resourceRepository.update(id, updateData);
  }

  /**
   * Delete a resource by ID.
   * @param id Resource ID
   * @returns True if deleted, false otherwise
   */
  public async deleteResource(id: number): Promise<boolean> {
    return this.resourceRepository.delete(id);
  }
}
