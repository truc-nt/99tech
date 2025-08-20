import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DocumentationAPI",
      version: "1.0.0",
      description: "API documentation generated from JSDoc comments",
    },
  },
  // Point to all files containing JSDoc comments
  apis: [path.join(__dirname, "../routes/**/*.ts"), path.join(__dirname, "../controllers/**/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
