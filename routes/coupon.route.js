const express = require('express');
const couponRoute = express.Router();
const CouponService = require('../service/coupon.service');
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// Public route


// protected route

module.exports = couponRoute;