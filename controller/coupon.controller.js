const CouponService = require("../service/coupon.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");


class CouponController {
    static createCoupon = async (req, res) => {
        try {
            const { name, expiry, discount } = req.body;
            const Coupon = await CouponService.getCouponByPk({ name: name });
            if (Coupon) {
                return res.status(400).json({
                    success: false,
                    message: 'it\'s already exist'
                });
            }
            const newCoupon = await CouponService.createNewCoupon({
                name: name,
                expiry: expiry,
                discount: discount
            });

            return res.status(201).json({
                success: true,
                coupon: newCoupon
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to create new coupon",
                errMessage: err.message
            });
        }
    }

    static getAllCoupon = async (req, res) => {
        try {
            const allCoupon = await CouponService.getAllCoupon();

            return res.status(201).json({
                success: true,
                coupon: allCoupon
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to create get data",
                errMessage: err.message
            });
        }
    }

    static getCouponById = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }

            const coupon = await CouponService.getCouponByPk({ _id: id });
            return res.status(200).json({
                success: true,
                coupon: coupon
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to get coupon",
                errMessage: err.message
            });
        }
    }

    static updateCoupon = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }

            const coupon = await CouponService.updateCouponDetailsById(id, req.body);
            return res.status(201).json({
                success: true,
                message: 'successfully update coupon'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update coupon",
                errMessage: err.message
            });
        }
    }

    static deleteCoupon = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }

            await CouponService.updateCouponDetailsById(id, { isDeleted: true });
            return res.status(201).json({
                success: true,
                message: 'successfully delete coupon'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete coupon",
                errMessage: err.message
            });
        }
    }
}

module.exports = CouponController;