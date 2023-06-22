const express = require('express');
const blogRoute = express.Router();
const BlogController = require("../controller/blog.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route
blogRoute.get('/:blogId', BlogController.getBlog);
blogRoute.get('/', BlogController.getAllBlog);

// protected route
blogRoute.post('/add-new-blog', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.createBlog);
blogRoute.post('/update-blog/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.updateBlog);
blogRoute.post('/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.deleteBlog);
blogRoute.post('/blog-likes', [authMiddleware], BlogController.likeBlog);
blogRoute.post('/likes', [authMiddleware], BlogController.likeBlog);
blogRoute.post('/dislikes', [authMiddleware], BlogController.dislikeBlog);

module.exports = blogRoute;