const express = require('express');
const blogRoute = express.Router();
const BlogController = require("../controller/blog.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { upload, blogImgResize } = require('../middleware/multer.middleware');
const multerErrorHandlerMiddleware = require('../middleware/multerErrorHandler.middleware');
const fields = [{ name: 'images', maxCount: 10 }];
const { role } = require('../models/user.model');

// Public route
blogRoute.get('/get-blog/:blogId', BlogController.getBlog);
blogRoute.get('get-all-blog/', BlogController.getAllBlog);

// protected route
blogRoute.post('/add-blog', [authMiddleware, authorizeRole([role.ADMIN]), upload.fields(fields), multerErrorHandlerMiddleware, blogImgResize], BlogController.createBlog);
blogRoute.post('/update-blog/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.updateBlog);
blogRoute.post('/delete-blog/:blogId', [authMiddleware, authorizeRole([role.ADMIN])], BlogController.deleteBlog);
blogRoute.post('/likes-blog', [authMiddleware], BlogController.likeBlog);
blogRoute.post('/dislikes-blog', [authMiddleware], BlogController.dislikeBlog);

module.exports = blogRoute;