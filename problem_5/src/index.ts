import express from "express";
import { createApiRouter } from "./routes/api.route";
import { setUpDependencies } from "./core/container";
import { setupSwagger } from "./docs/swagger";

setUpDependencies();

const app = express();
app.use(express.json());

// Mount API routes
app.use("/api", createApiRouter());

// Set up Swagger UI
setupSwagger(app);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger UI available at http://localhost:3000/api-docs");
});
