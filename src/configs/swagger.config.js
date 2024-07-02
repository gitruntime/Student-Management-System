require("dotenv").config()
const swaggerJsdoc = require('swagger-jsdoc');
const path = require("path");
const { url } = require("inspector");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management System API',
      version: '1.0.0',
      description: 'API documentation for the Student Management System',
      contact:{
        name:'Runtime Solutions Pvt Ltd'
      }
    },
    servers: [
      {
        url: process.env.PROJECT_URL,
      },
    ],
  },
  apis: [path.join(__dirname, '../../docs/swagger/*.js')], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
