const express = require('express');
const enquiryRoute = express.Router();
const EnquiryController = require("../controller/enquiry.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// protected route
enquiryRoute.post('/create-enquiry', [authMiddleware], EnquiryController.createEnquiry);
enquiryRoute.get('/get-enquiry/:id', [authMiddleware], EnquiryController.getEnquiryById);
enquiryRoute.post('/update-enquiry/:id', [authMiddleware, authorizeRole([role.ADMIN])], EnquiryController.updateEnquiry);
enquiryRoute.get('/get-all-enquiry', [authMiddleware, authorizeRole([role.ADMIN])], EnquiryController.getAllEnquiry);
enquiryRoute.post('/delete-enquiry/:id', [authMiddleware, authorizeRole([role.ADMIN])], EnquiryController.deleteEnquiry);

module.exports = enquiryRoute;