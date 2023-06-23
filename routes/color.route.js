const express = require('express');
const colorRoute = express.Router();
const ColorController = require('../controller/color.controller');
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route
colorRoute.get('/get-color/:id', ColorController.getColorById);
colorRoute.get('/get-all-colors', ColorController.getAllColor);

// protected route
colorRoute.post('/add-color', [authMiddleware, authorizeRole([role.ADMIN])], ColorController.createColor);
colorRoute.post('/update-color/:id', [authMiddleware, authorizeRole([role.ADMIN])], ColorController.updateColor);
colorRoute.post('/delete-color/:id', [authMiddleware, authorizeRole([role.ADMIN])], ColorController.deleteColor);

module.exports = colorRoute;