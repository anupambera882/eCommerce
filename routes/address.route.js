const express = require('express');
const addressRoute = express.Router();
const AddressController = require("../controller/address.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');

// Public route


// protected route

module.exports = addressRoute;