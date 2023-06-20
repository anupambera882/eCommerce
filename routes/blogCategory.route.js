const express = require('express');
const blogCategoryRoute = express.Router();
const BlogCategoryController = require("../controller/blogCategory.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route


// protected route

module.exports = blogCategoryRoute;