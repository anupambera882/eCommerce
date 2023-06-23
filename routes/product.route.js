const express = require('express')
const productRoute = express.Router();
const ProductController = require("../controller/product.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');
const { upload, productImgResize } = require('../middleware/multer.middleware');
const multerErrorHandlerMiddleware = require('../middleware/multerErrorHandler.middleware');
const fields = [{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 8 }];

// Public Routes
productRoute.get('/get-All-product', ProductController.getAllProducts);
productRoute.get('/get-product/:productId', ProductController.getProductById);


// Protected Routes
productRoute.post('/add-product', [authMiddleware, authorizeRole([role.ADMIN])], ProductController.createNewProduct);
productRoute.post('/update-product/:productId', [authMiddleware, authorizeRole([role.ADMIN])], ProductController.updateProductById);
productRoute.post('/delete-product/:productId', [authMiddleware, authorizeRole([role.ADMIN])], ProductController.deleteProductById);
productRoute.post('/wishList', [authMiddleware], ProductController.addToWishList);
productRoute.post('/rating', [authMiddleware], ProductController.rating);
productRoute.post('/uploadImages/:id', [upload.fields(fields), multerErrorHandlerMiddleware, productImgResize], ProductController.uploadImages);

module.exports = productRoute;