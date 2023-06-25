const express = require('express');
const couponRoute = express.Router();
const CouponController = require('../controller/coupon.controller')
const { authMiddleware, authorizeRole } = require('../middleware/auth.middleware');
const { role } = require('../models/user.model');

// protected route
couponRoute.post('/add-coupon', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.createCoupon)
couponRoute.post('/update-coupon/:id', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.updateCoupon)
couponRoute.get('/get-all-coupon', [authMiddleware], CouponController.getAllCoupon)
couponRoute.get('/get-coupon/:id', [authMiddleware], CouponController.getCouponById)
couponRoute.post('/delete-coupon/:id', [authMiddleware, authorizeRole([role.ADMIN])], CouponController.deleteCoupon)

module.exports = couponRoute;