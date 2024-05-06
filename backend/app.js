const path = require('path');
const puppeteer = require('puppeteer');
const cookieParser = require('cookie-parser');
const csvtojson = require('csvtojson');
const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const jwt = require('jsonwebtoken');
app.use(cookieParser());
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static("public"))
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const indexRouter = require('./routes/IndexRouter');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API for project',
    },
    servers: [
      {
        url: 'http://localhost:1509',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/', indexRouter);

morgan('combined')

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = 1509;
app.listen(port, () => {
  console.log(`App listening http://localhost:${port}`)
})