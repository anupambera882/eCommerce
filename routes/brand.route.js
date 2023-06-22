const express = require('express');
const brandRoute = express.Router();
const BrandController = require('../controller/brand.controller');
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');


// Public route
brandRoute.get('/get-brand/:id', BrandController.getBrandById)
brandRoute.get('/get-all-brands', BrandController.getAllBrand)

// protected route
brandRoute.post('/add-brand', [authMiddleware, authorizeRole([role.ADMIN])], BrandController.createBrand)
brandRoute.post('/update-brand/:id', [authMiddleware, authorizeRole([role.ADMIN])], BrandController.updateBrand)
brandRoute.post('/delete-brand/:id', [authMiddleware, authorizeRole([role.ADMIN])], BrandController.deleteBrand)

module.exports = brandRoute;