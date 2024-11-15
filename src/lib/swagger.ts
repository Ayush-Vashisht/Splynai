import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", 
    definition: {
      openapi: "3.0.0",
      info: {
        title: "spyneai",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
      paths: {
        "/api/cars": {
          get: {
            summary: "Get Cars",
            description: "Fetch cars based on search term, limit, and page number.",
            parameters: [
              { name: "userId", in: "query", required: true, schema: { type: "string" } },
              { name: "searchTerm", in: "query", required: true, schema: { type: "string" } },
              { name: "limit", in: "query", required: false, schema: { type: "integer", default: 6 } },
              { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
            ],
            responses: {
              200: {
                description: "List of cars",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          model: { type: "string" },
                          brand: { type: "string" },
                          year: { type: "integer" },
                          price: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/car": {
          get: {
            summary: "Get a Car",
            description: "Fetch details of a specific car by its ID.",
            parameters: [
              { name: "userId", in: "query", required: true, schema: { type: "string" } },
              { name: "id", in: "query", required: true, schema: { type: "string" } },
            ],
            responses: {
              200: {
                description: "Car details",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        model: { type: "string" },
                        brand: { type: "string" },
                        year: { type: "integer" },
                        price: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
          put: {
            summary: "Update a Car",
            description: "Update the details of a specific car.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      car: {
                        type: "object",
                        properties: {
                          model: { type: "string" },
                          brand: { type: "string" },
                          year: { type: "integer" },
                          price: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Car updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          delete: {
            summary: "Delete a Car",
            description: "Delete a specific car by its ID.",
            parameters: [
              { name: "id", in: "query", required: true, schema: { type: "string" } },
            ],
            responses: {
              200: {
                description: "Car deleted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Add a Car",
            description: "Add a new car to the database.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      car: {
                        type: "object",
                        properties: {
                          model: { type: "string" },
                          brand: { type: "string" },
                          year: { type: "integer" },
                          price: { type: "number" },
                        },
                      },
                      userId: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Car added successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/register": {
          post: {
            summary: "Create a User",
            description: "Create a new user and return the token and user ID.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      fullname: { type: "string" },
                      email: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "User created successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        userId: { type: "string" },
                        token: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/signin": {
          post: {
            summary: "Sign in a User",
            description: "Authenticate a user with email and password.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "User authenticated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        userId: { type: "string" },
                        token: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
