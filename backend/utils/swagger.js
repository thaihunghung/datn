const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Analysis API',
      version: '1.0.0',
      description: 'API for learning analysis, providing endpoints to manage and analyze learning data.',
      termsOfService: 'http://example.com/terms',
      contact: {
        name: 'API Support',
        url: 'http://example.com/support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:1509',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust this path as needed
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
