const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Blog App",
      description: "Blog Application Rest API Information",
      contact: {
        name: "Varad",
      },
      servers: [
        {
          api: "http://localhost:5000/",
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/swagger/*.js"],
};

module.exports = swaggerOptions;
