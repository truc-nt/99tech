import { Router } from "express";
import { createResourceRouter } from "./resource.route";

/**
 * @swagger
 * tags:
 *   name: API
 *   description: Main API router containing all module routes
 */

/**
 * Create the main API router and mount all versioned or module routes.
 *
 * Currently mounts:
 * - /resources → Resource routes
 *
 * @returns Configured Express Router instance
 */
export function createApiRouter(): Router {
  const apiRouter = Router();

  // Mount Resource routes under /resources
  apiRouter.use("/resources", createResourceRouter());

  return apiRouter;
}
