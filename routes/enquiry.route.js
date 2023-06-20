const express = require('express');
const enquiryRoute = express.Router();
const EnquiryController = require("../controller/enquiry.controller");
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route


// protected route

module.exports = enquiryRoute;