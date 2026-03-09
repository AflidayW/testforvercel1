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
      { url: "https://testforvercelone.vercel.app/" },
      { url: "http://localhost:5000" }
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic"
        }
      }
    },

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
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", maxLength: 40 },
                    author: { type: "string", maxLength: 20 },
                    canBeDownloaded: { type: "boolean" },
                    availableResolutions: {
                      type: "array",
                      items: {
                        type: "string",
                        enum: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
                      }
                    }
                  },
                  required: ["title", "author", "availableResolutions"]
                }
              }
            }
          },
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
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", maxLength: 40 },
                    author: { type: "string", maxLength: 20 },
                    canBeDownloaded: { type: "boolean" },
                    minAgeRestriction: { type: "integer", minimum: 1, maximum: 18, nullable: true },
                    publicationDate: { type: "string" },
                    availableResolutions: {
                      type: "array",
                      items: {
                        type: "string",
                        enum: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
                      }
                    }
                  },
                  required: ["title", "author", "availableResolutions"]
                }
              }
            }
          },
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
      },

      "/blogs": {
        get: {
          summary: "Get a list of all blogs",
          tags: ["Blogs"],
          responses: {
            200: { description: "List of all blogs" }
          }
        },
        post: {
          summary: "Create a new blog",
          security: [{ basicAuth: [] }],
          tags: ["Blogs"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", maxLength: 15 },
                    description: { type: "string", maxLength: 500 },
                    websiteUrl: { type: "string", maxLength: 100 }
                  },
                  required: ["name", "description", "websiteUrl"]
                }
              }
            }
          },
          responses: {
            201: { description: "Blog created" },
            400: { description: "Validation error" }
          }
        }
      },

      "/blogs/{id}": {
        get: {
          summary: "Get blog by ID",
          tags: ["Blogs"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Blog found" },
            404: { description: "Blog Not Found" }
          }
        },
        put: {
          summary: "Update blog by ID",
          security: [{ basicAuth: [] }],
          tags: ["Blogs"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", maxLength: 15 },
                    description: { type: "string", maxLength: 500 },
                    websiteUrl: { type: "string", maxLength: 100 }
                  },
                  required: ["name", "description", "websiteUrl"]
                }
              }
            }
          },
          responses: {
            204: { description: "Blog updated" },
            400: { description: "Validation error" },
            404: { description: "Blog Not Found" }
          }
        },
        delete: {
          summary: "Delete blog by ID",
          security: [{ basicAuth: [] }],
          tags: ["Blogs"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: {
            204: { description: "Blog deleted" },
            404: { description: "Blog Not Found" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.get("/api/swagger.json", (req, res) => {
    res.json(swaggerSpec);
  });

  app.get("/api", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script>
            SwaggerUIBundle({
              url: "/api/swagger.json",
              dom_id: '#swagger-ui',
            })
          </script>
        </body>
      </html>
    `);
  });
};