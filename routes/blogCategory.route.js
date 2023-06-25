const express = require('express');
const blogCategoryRoute = express.Router();
const BlogCategoryController = require("../controller/blogCategory.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route
blogCategoryRoute.get('/get-Blog-category/:id', BlogCategoryController.getBlogCategoryById);
blogCategoryRoute.get('/get-all-Blog-category', BlogCategoryController.getAllBlogCategory);

// protected route
blogCategoryRoute.post('/add-category', [authMiddleware, authorizeRole([role.ADMIN])], BlogCategoryController.createBlogCategory);
blogCategoryRoute.post('/update-category/:id', [authMiddleware, authorizeRole([role.ADMIN])], BlogCategoryController.updateBlogCategory);
blogCategoryRoute.post('/delete-category/:id', [authMiddleware, authorizeRole([role.ADMIN])], BlogCategoryController.deleteBlogCategory);

module.exports = blogCategoryRoute;