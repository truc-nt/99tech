# Problem 5 - RESTful API Project

## Project Description

This project is a RESTful API built with TypeScript, following a clean architecture pattern:

- **Controller → Service → Repository → Database**
- Uses **Dependency Injection** for modularity and testability.

### Architectural Highlights

- **Controller Layer:** Handles HTTP requests. All controllers extend from `BaseController`, which provides utility functions such as `getQueryParam` for extracting query parameters in a type-safe way.
- **Service Layer:** Contains business logic and orchestrates data flow between controllers and repositories.
- **Repository Layer:** Abstracts database operations. All repositories extend from `BaseRepository`, which provides generic SQL query builders and type-safe value coercion. Usable functions include:
  - `buildWhereClause` for dynamic filtering
  - `buildOrderByClause` for sorting
  - `buildLimitOffsetClause` for pagination
  - `buildInsertQuery` for insert operations
  - `buildUpdateClause` for update operations
- **Database Layer:** Uses SQLite for data persistence.

## Configuration

- **Database:** SQLite (`database.sqlite`)
- **TypeScript:** Configured via `tsconfig.json`
- **Prettier:** Code formatting via `prettier.config.cjs`
- **API Documentation:** Swagger setup in `src/docs/swagger.ts`

## How to Run the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application (Development)

```bash
npm run dev
```

### 3. Build and Run (Production)

```bash
npm run build
npm start
```

### 4. API Documentation

When running, the API documentation is available at the endpoint:

```
/api-docs/
```

Open this URL in your browser to view and interact with the Swagger UI for all available endpoints.

## Folder Structure

```
src/
  controllers/      # Request handling, all controllers extend BaseController
  core/             # Dependency injection container
  db/               # SQLite connection
  docs/             # Swagger setup
  models/           # Data models and schemas
  repositories/     # Data access layer, all repositories extend BaseRepository
  routes/           # API route definitions
  services/         # Business logic
```

## Why This Structure?

You may notice the project structure is more elaborate than strictly necessary for a small assignment. This is intentional: when starting a new project, I set up a scalable, modular architecture from the beginning. This approach allows for easy reuse, extension, and maintenance in future projects, regardless of size. By separating concerns (controller, service, repository, database) and using dependency injection, the codebase remains clean and adaptable as requirements grow.
