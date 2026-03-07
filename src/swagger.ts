import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "hosting API",
      version: "1.0.0",
      description: "hosting API",
    },
    servers: [
      { url: "https://testforvercelone.vercel.app/", },

      { url: "http://localhost:5000", }

    ],

    paths: {
      "/videos": {
        get: {
          summary: "Get a list of all videos",
          tags: ["Videos"],
          responses: {
            200: { description: "List of all videos" }
          }
        },
        post: {
          summary: "Create a new video",
          tags: ["Videos"],
          responses: {
            201: { description: "Video created" },
            400: { description: "Validation error" }
          }
        }
      },
      "/videos/{id}": {
        get: {
          summary: "Get video by ID",
          tags: ["Videos"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Video found" },
            404: { description: "Video Not Found" }
          }
        },
        put: {
          summary: "Update video by ID",
          tags: ["Videos"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: {
            204: { description: "Video updated" },
            400: { description: "Validation error" },
            404: { description: "Video Not Found" }
          }
        },
        delete: {
          summary: "Delete video by ID",
          tags: ["Videos"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: {
            204: { description: "Video deleted" },
            404: { description: "Video Not Found" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api/swagger.json"
    }
  }));

  app.get("/api/swagger.json", (req, res) => {
    res.json(swaggerSpec);
  });
}
