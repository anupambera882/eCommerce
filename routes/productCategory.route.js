const express = require('express');
const productCategoryRoute = express.Router();
const ProductCategoryController = require('../controller/productCategory.controller');
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');


// Public route
productCategoryRoute.get('/get-product-category/:id', ProductCategoryController.getProductCategoryById)
productCategoryRoute.get('/get-all-product-category', ProductCategoryController.getAllProductCategory)

// protected route
productCategoryRoute.post('/add-new-category', [authMiddleware, authorizeRole([role.ADMIN])], ProductCategoryController.createProductCategory)
productCategoryRoute.post('/update-category/:id', [authMiddleware, authorizeRole([role.ADMIN])], ProductCategoryController.updateProductCategory)
productCategoryRoute.post('/delete-category/:id', [authMiddleware, authorizeRole([role.ADMIN])], ProductCategoryController.deleteProductCategory)


module.exports = productCategoryRoute;