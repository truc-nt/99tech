import { Request, Response } from "express";
import { IResourceService } from "../services/resource.service";
import { CreateResourceSchema, UpdateResourceSchema } from "../models/resource.schema";
import BaseController from "./base.controller";

/**
 * Interface for ResourceController, defining all RESTful endpoints.
 */
interface IResourceController {
  getResources(req: Request, res: Response): Promise<Response>;
  getResource(req: Request, res: Response): Promise<Response>;
  createResource(req: Request, res: Response): Promise<Response>;
  updateResource(req: Request, res: Response): Promise<Response>;
  deleteResource(req: Request, res: Response): Promise<Response>;
}

/**
 * Controller handling Resource endpoints.
 * Delegates CRUD operations to the ResourceService.
 */
export default class ResourceController extends BaseController implements IResourceController {
  /**
   * @param resourceService Service layer for Resource operations
   */
  constructor(private readonly resourceService: IResourceService) {
    super();
  }

  /**
   * Get a list of resources with query parameters (limit, offset, sort, filters).
   * @param req Express request object
   * @param res Express response object
   * @returns JSON response with array of resources
   */
  public getResources = async (req: Request, res: Response): Promise<Response> => {
    const resources = await this.resourceService.getResources(this.getQueryParam(req));
    return res.status(200).json(resources);
  };

  /**
   * Get a single resource by ID.
   * @param req Express request object containing resource ID in params
   * @param res Express response object
   * @returns JSON response with resource or error message
   */
  public getResource = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid resource ID" });
    }

    const resource = await this.resourceService.getResource(id);
    if (!resource) {
      return res.status(404).send({ message: "Resource not found" });
    }
    return res.status(200).json(resource);
  };

  /**
   * Create a new resource.
   * Validates request body against CreateResourceSchema before saving.
   * @param req Express request object containing resource data in body
   * @param res Express response object
   * @returns JSON response with success message or validation errors
   */
  public createResource = async (req: Request, res: Response): Promise<Response> => {
    const parseResult = CreateResourceSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        message: parseResult.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const newResource = await this.resourceService.createResource(parseResult.data);
    if (!newResource) {
      return res.status(500).send({ message: "Failed to create resource" });
    }

    return res.status(201).json({
      message: "Resource created successfully",
    });
  };

  /**
   * Update an existing resource by ID.
   * Validates request body against UpdateResourceSchema and checks if resource exists.
   * @param req Express request object containing resource ID in params and updated data in body
   * @param res Express response object
   * @returns JSON response with success message or error
   */
  public updateResource = async (req: Request, res: Response): Promise<Response> => {
    const parseResult = UpdateResourceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        message: parseResult.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid resource ID" });
    }

    const updatedResource = await this.resourceService.updateResource(id, parseResult.data);
    if (!updatedResource) {
      return res.status(404).send({ message: "Resource not found" });
    }

    return res.status(200).send({ message: "Resource updated successfully" });
  };

  /**
   * Delete a resource by ID.
   * @param req Express request object containing resource ID in params
   * @param res Express response object
   * @returns JSON response with success message or error if resource not found
   */
  public deleteResource = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid resource ID" });
    }

    const deletedResource = await this.resourceService.deleteResource(id);
    if (!deletedResource) {
      return res.status(404).send({ message: "Resource not found" });
    }
    return res.status(200).send({ message: "Resource deleted successfully" });
  };
}
