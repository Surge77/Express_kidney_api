const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🏥 Hospital Kidney API",
      version: "1.0.0",
      description: "API for managing users and kidneys (add, donate, replace, remove)"
    },
    servers: [
      { url: "http://localhost:3000" }
    ]
  },
  apis: ["./doctor.js"], // path(s) to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
