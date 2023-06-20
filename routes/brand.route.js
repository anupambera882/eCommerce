const express = require('express');
const brandRoute = express.Router();
const BrandService = require('../service/brand.service');
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');


// Public route


// protected route

module.exports = brandRoute;