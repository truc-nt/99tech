import { Router } from "express";
import { DIContainer } from "../core/container";
import ResourceController from "../controllers/resource.controller";

/**
 * Creates the router for Resource endpoints.
 * @returns Configured Express Router instance
 */
export function createResourceRouter(): Router {
  const router = Router();

  // Resolve controller after DIContainer is ready
  const container = DIContainer.getInstance();
  const resourceController = container.resolve<ResourceController>("ResourceController");

  /**
   * @swagger
   * /api/resources:
   *   get:
   *     tags: [API]
   *     summary: Retrieve a list of resources
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of results to return
   *         example: 10
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description: Starting index for pagination
   *         example: 0
   *       - in: query
   *         name: sort
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *             example: "name,asc"
   *         style: form
   *         explode: true
   *         description: Comma-separated field and order, e.g., name,asc. Can be repeated multiple times for multi-column sorting.
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         description: Filter by resource ID
   *         example: 1
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: Filter by resource name
   *         example: "Resource 1"
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, inactive]
   *         description: Filter by resource status
   *         example: "active"
   *     responses:
   *       200:
   *         description: A list of resources
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Resource'
   *             examples:
   *               example1:
   *                 value:
   *                   - id: 1
   *                     name: "Resource 1"
   *                     description: "First resource"
   *                     status: "active"
   *                     createdAt: "2025-08-20 00:00:00"
   *                     updatedAt: "2025-08-20 00:00:00"
   *                   - id: 2
   *                     name: "Resource 2"
   *                     description: "Second resource"
   *                     status: "inactive"
   *                     createdAt: "2025-08-19 00:00:00"
   *                     updatedAt: "2025-08-19 00:00:00"
   */
  router.get("/", resourceController.getResources);

  /**
   * @swagger
   * /api/resources/{id}:
   *   get:
   *     tags: [API]
   *     summary: Retrieve a single resource
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Resource ID
   *         example: 1
   *     responses:
   *       200:
   *         description: Resource found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Resource'
   *             examples:
   *               example:
   *                 value:
   *                   id: 1
   *                   name: "Resource 1"
   *                   description: "First resource"
   *                   status: "active"
   *                   createdAt: "2025-08-20 00:00:00"
   *                   updatedAt: "2025-08-20 00:00:00"
   *       404:
   *         description: Resource not found
   */
  router.get("/:id", resourceController.getResource);

  /**
   * @swagger
   * /api/resources:
   *   post:
   *     tags: [API]
   *     summary: Create a new resource
   *     requestBody:
   *       required: true
   *       description: |
   *         The request body must be a JSON object matching the CreateResourceDto schema:
   *         {
   *           "name": string (required),
   *           "description": string (optional),
   *           "status": "active" | "inactive" (optional)
   *         }
   *         Example:
   *         {
   *           "name": "New Resource",
   *           "description": "A new resource to add",
   *           "status": "active"
   *         }
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateResourceDto'
   *           examples:
   *             example:
   *               value:
   *                 name: "New Resource"
   *                 description: "A new resource to add"
   *                 status: "active"
   *     responses:
   *       201:
   *         description: Resource created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Resource created successfully
   *       400:
   *         description: Validation failed
   */
  router.post("/", resourceController.createResource);

  /**
   * @swagger
   * /api/resources/{id}:
   *   patch:
   *     tags: [API]
   *     summary: Update an existing resource
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Resource ID
   *         example: 1
   *     requestBody:
   *       required: true
   *       description: |
   *         The request body must be a JSON object matching the UpdateResourceDto schema:
   *         {
   *           "name": string (optional),
   *           "description": string (optional),
   *           "status": "active" | "inactive" (optional)
   *         }
   *         Example:
   *         {
   *           "name": "Updated Resource Name",
   *           "description": "Updated description",
   *           "status": "inactive"
   *         }
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateResourceDto'
   *           examples:
   *             example:
   *               value:
   *                 name: "Updated Resource Name"
   *                 description: "Updated description"
   *                 status: "inactive"
   *     responses:
   *       200:
   *         description: Resource updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Resource updated successfully
   *       400:
   *         description: Validation failed
   *       404:
   *         description: Resource not found
   */
  router.patch("/:id", resourceController.updateResource);

  /**
   * @swagger
   * /api/resources/{id}:
   *   delete:
   *     tags: [API]
   *     summary: Delete a resource
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Resource ID
   *         example: 1
   *     responses:
   *       200:
   *         description: Resource deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Resource deleted successfully
   *       404:
   *         description: Resource not found
   */
  router.delete("/:id", resourceController.deleteResource);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Resource:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           example: 1
   *         name:
   *           type: string
   *           example: "Resource 1"
   *         description:
   *           type: string
   *           example: "First resource"
   *         status:
   *           type: string
   *           enum: [active, inactive]
   *           example: "active"
   *         createdAt:
   *           type: string
   *           format: date-time
   *           example: "2025-08-20 00:00:00"
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           example: "2025-08-20 00:00:00"
   *     CreateResourceDto:
   *       type: object
   *       required:
   *         - name
   *       properties:
   *         name:
   *           type: string
   *           example: "New Resource"
   *         description:
   *           type: string
   *           example: "A new resource to add"
   *         status:
   *           type: string
   *           enum: [active, inactive]
   *           example: "active"
   *     UpdateResourceDto:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           example: "Updated Resource Name"
   *         description:
   *           type: string
   *           example: "Updated description"
   *         status:
   *           type: string
   *           enum: [active, inactive]
   *           example: "inactive"
   */

  return router;
}
