const express = require('express');
const blogRoute = express.Router();
const BlogController = require("../controller/blog.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { upload, blogImgResize } = require('../middleware/multer.middleware');
const multerErrorHandlerMiddleware = require('../middleware/multerErrorHandler.middleware');
const fields = [{ name: 'images', maxCount: 10 }];
const { role } = require('../models/user.model');

// Public route
blogRoute.get('/:blogId', BlogController.getBlog);
blogRoute.get('/', BlogController.getAllBlog);

// protected route
blogRoute.post('/add-new-blog', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.createBlog);
blogRoute.post('/update-blog/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.updateBlog);
blogRoute.post('/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.deleteBlog);
blogRoute.post('/likes-blog', [authMiddleware], BlogController.likeBlog);
blogRoute.post('/dislikes-blog', [authMiddleware], BlogController.dislikeBlog);
blogRoute.post('/uploadImages/:id', [authMiddleware, upload.fields(fields), multerErrorHandlerMiddleware, blogImgResize], BlogController.uploadImages);

module.exports = blogRoute;