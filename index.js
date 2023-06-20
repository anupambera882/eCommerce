require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dbConnect = require("./config/dbConnect.config");
const router = require('./routes/index.route');

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
await dbConnect();

// Serve Static file
app.use(express.static(path.join(__dirname, 'public')));

// Show request in terminal
app.use(morgan('dev'));

// Load Routes
router(app);

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}/`);
});