const express = require('express');
const addressRoute = express.Router();
const AddressController = require("../controller/address.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');

// protected route
addressRoute.post('/add-address', [authMiddleware], AddressController.createAddress);
addressRoute.post('/update-address', [authMiddleware], AddressController.updateAddress);
addressRoute.post('/delete-address', [authMiddleware], AddressController.deleteAddress);
addressRoute.get('/get-address/:id', [authMiddleware], AddressController.getAddressById);
addressRoute.get('/get-all-address', [authMiddleware], AddressController.getAllAddressOfAUser);

module.exports = addressRoute;