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

const indexRouter = require('./routes/IndexRouter');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


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