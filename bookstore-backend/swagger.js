// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "📚 Bookstore Management API",
      version: "1.0.5",
      description: `
Welcome to the **Bookstore Management API Documentation**!

This API allows you to manage users, books, orders, analytics, ratings, wishlists, and carts — with **role-based authentication**, **JWT protection**, and a clean RESTful design.

### 🚀 Quick Start
1. Click **Authorize 🔒** at the top right.
2. Enter your JWT token in the format:
   \`Bearer <your_token>\`
3. Explore the endpoints below.

---
`,
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
      {
        url: "https://erp-backend-w1x2.onrender.com",
        description: "Production Server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at /api-docs");
}

module.exports = swaggerDocs;
