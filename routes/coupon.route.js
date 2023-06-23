const express = require('express');
const couponRoute = express.Router();
const CouponController = require('../controller/coupon.controller')
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// protected route
couponRoute.get('/create-coupon', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.createCoupon)
couponRoute.post('/update-coupon/:id', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.updateCoupon)
couponRoute.post('/get-all-coupon', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.getAllCoupon)
couponRoute.post('/delete-coupon', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.deleteCoupon)

module.exports = couponRoute;