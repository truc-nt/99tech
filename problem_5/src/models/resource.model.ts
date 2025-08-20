import { TableDescriptor } from "./repository.model";

/**
 * Possible statuses for a resource.
 * - Active: The resource is active
 * - Inactive: The resource is inactive
 */
export enum ResourceStatus {
  Active = "active",
  Inactive = "inactive",
}

/**
 * Table descriptor for the "resources" table
 * Defines the table name and the data type of each column.
 */
export const ResourceTableDescriptor: TableDescriptor = {
  tableName: "resources",
  columnTypes: {
    id: "number",
    name: "string",
    description: "string",
    status: "string",
    createdAt: "date",
    updatedAt: "date",
    rating: "number",
  },
};

/**
 * Resource entity type
 *
 * Properties:
 * - id: Unique identifier
 * - name: Name of the resource
 * - description: Resource description
 * - status: Current status of the resource
 * - createdAt: Creation timestamp
 * - updatedAt: Last update timestamp
 */
export type Resource = {
  id: number;
  name: string;
  description: string;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
};
