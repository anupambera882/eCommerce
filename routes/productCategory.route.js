const express = require('express');
const productCategoryRoute = express.Router();
const ProductCategoryService = require("../service/productCategory.service");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route


// protected route

module.exports = productCategoryRoute;