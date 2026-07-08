const successResponse = {
  success: true,
  message: "string",
  data: {},
};

const errorResponse = {
  success: false,
  message: "string",
  errorDetails: {},
};

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "FixItNow API",
    version: "1.0.0",
    description:
      "Programming Hero assignment backend for FixItNow - Your Trusted Home Service Platform",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    responses: {
      SuccessResponse: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string" },
                data: { type: "object" },
              },
            },
            examples: {
              success: {
                value: successResponse,
              },
            },
          },
        },
      },
      ErrorResponse: {
        description: "Error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string" },
                errorDetails: { type: "object" },
              },
            },
            examples: {
              error: {
                value: errorResponse,
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "name",
                  "email",
                  "password",
                  "confirmPassword",
                  "role",
                ],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  confirmPassword: { type: "string" },
                  phone: { type: "string" },
                  avatarUrl: { type: "string", format: "uri" },
                  role: {
                    type: "string",
                    enum: ["CUSTOMER", "TECHNICIAN", "ADMIN"],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { $ref: "#/components/responses/SuccessResponse" },
          400: { $ref: "#/components/responses/ErrorResponse" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
          401: { $ref: "#/components/responses/ErrorResponse" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
          401: { $ref: "#/components/responses/ErrorResponse" },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
          401: { $ref: "#/components/responses/ErrorResponse" },
          404: { $ref: "#/components/responses/ErrorResponse" },
        },
      },
    },
    "/users/profile": {
      patch: {
        tags: ["Users"],
        summary: "Update the current user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  phone: { type: "string" },
                  avatarUrl: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/users/password": {
      patch: {
        tags: ["Users"],
        summary: "Change the current user password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "currentPassword",
                  "newPassword",
                  "confirmNewPassword",
                ],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                  confirmNewPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/technicians": {
      get: {
        tags: ["Technicians"],
        summary: "List technicians",
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/technicians/{id}": {
      get: {
        tags: ["Technicians"],
        summary: "Get technician profile",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
          404: { $ref: "#/components/responses/ErrorResponse" },
        },
      },
    },
    "/technicians/profile": {
      patch: {
        tags: ["Technicians"],
        summary: "Create or update the current technician profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["location", "skills"],
                properties: {
                  bio: { type: "string" },
                  experienceYears: { type: "number" },
                  location: { type: "string" },
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                  hourlyRate: { type: "number" },
                  serviceRadius: { type: "number" },
                  portfolioUrl: { type: "string", format: "uri" },
                  skills: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/technicians/availability": {
      get: {
        tags: ["Technicians"],
        summary: "List current technician availability",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      post: {
        tags: ["Technicians"],
        summary: "Create a technician availability slot",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["dayOfWeek", "startTime", "endTime"],
                properties: {
                  dayOfWeek: { type: "string" },
                  startTime: { type: "string" },
                  endTime: { type: "string" },
                  isAvailable: { type: "boolean" },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/technicians/availability/{id}": {
      patch: {
        tags: ["Technicians"],
        summary: "Update a technician availability slot",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      delete: {
        tags: ["Technicians"],
        summary: "Delete a technician availability slot",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a category",
        security: [{ bearerAuth: [] }],
        responses: {
          201: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get a category by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
      patch: {
        tags: ["Categories"],
        summary: "Update a category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
      delete: {
        tags: ["Categories"],
        summary: "Deactivate a category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/services": {
      get: {
        tags: ["Services"],
        summary: "Search and list services",
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      post: {
        tags: ["Services"],
        summary: "Create a service",
        security: [{ bearerAuth: [] }],
        responses: {
          201: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Get service details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      patch: {
        tags: ["Services"],
        summary: "Update a service",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
      delete: {
        tags: ["Services"],
        summary: "Deactivate a service",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create a booking",
        security: [{ bearerAuth: [] }],
        responses: {
          201: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/bookings/my": {
      get: {
        tags: ["Bookings"],
        summary: "List current customer bookings",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/bookings/technician": {
      get: {
        tags: ["Bookings"],
        summary: "List current technician bookings",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get booking details",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { $ref: "#/components/responses/SuccessResponse" },
        },
      },
    },
    "/bookings/{id}/accept": {
      patch: {
        tags: ["Bookings"],
        summary: "Accept a booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/bookings/{id}/decline": {
      patch: {
        tags: ["Bookings"],
        summary: "Decline a booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/bookings/{id}/start": {
      patch: {
        tags: ["Bookings"],
        summary: "Start a booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/bookings/{id}/complete": {
      patch: {
        tags: ["Bookings"],
        summary: "Complete a booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/bookings/{id}/cancel": {
      patch: {
        tags: ["Bookings"],
        summary: "Cancel a booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/payments/intent": {
      post: {
        tags: ["Payments"],
        summary: "Create a Stripe payment intent",
        security: [{ bearerAuth: [] }],
        responses: { 201: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/payments/confirm": {
      post: {
        tags: ["Payments"],
        summary: "Confirm a payment",
        security: [{ bearerAuth: [] }],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/payments/history": {
      get: {
        tags: ["Payments"],
        summary: "Get payment history",
        security: [{ bearerAuth: [] }],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/payments/{id}": {
      get: {
        tags: ["Payments"],
        summary: "Get payment details",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create a review after a completed booking",
        security: [{ bearerAuth: [] }],
        responses: { 201: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/reviews/service/{serviceId}": {
      get: {
        tags: ["Reviews"],
        summary: "List reviews for a service",
        parameters: [
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/reviews/technician/{technicianId}": {
      get: {
        tags: ["Reviews"],
        summary: "List reviews for a technician",
        parameters: [
          {
            name: "technicianId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "List all users",
        security: [{ bearerAuth: [] }],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/admin/users/{id}/ban": {
      patch: {
        tags: ["Admin"],
        summary: "Ban a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/admin/users/{id}/unban": {
      patch: {
        tags: ["Admin"],
        summary: "Unban a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/admin/bookings": {
      get: {
        tags: ["Admin"],
        summary: "List all bookings",
        security: [{ bearerAuth: [] }],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
    "/admin/bookings/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get booking details as admin",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { $ref: "#/components/responses/SuccessResponse" } },
      },
    },
  },
} as const;
