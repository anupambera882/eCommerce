const express = require('express');
const blogRoute = express.Router();
const BlogController = require("../controller/blog.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route


// protected route
blogRoute.post('/add-new-blog', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.createBlog);
blogRoute.post('/add-new-blog', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.updateBlog);

module.exports = blogRoute;