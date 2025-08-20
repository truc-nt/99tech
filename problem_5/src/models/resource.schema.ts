import { z } from "zod";
import { ResourceStatus } from "../models/resource.model";

/**
 * Schema for creating a new resource
 *
 * Properties:
 * - name: Required, non-empty string
 * - description: Optional string
 * - status: Optional, must be one of ResourceStatus
 */
export const CreateResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(ResourceStatus).optional(),
});

/**
 * Schema for updating a resource
 * All fields are optional (partial of CreateResourceSchema)
 */
export const UpdateResourceSchema = CreateResourceSchema.partial();

/**
 * Type inferred from CreateResourceSchema
 */
export type CreateResourceDto = z.infer<typeof CreateResourceSchema>;

/**
 * Type inferred from UpdateResourceSchema
 */
export type UpdateResourceDto = z.infer<typeof UpdateResourceSchema>;
