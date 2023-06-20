const CouponService = require("../service/coupon.service");

class CouponController {
    static createCoupon = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getAllCoupon = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static updateCoupon = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static deleteCoupon = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }
}

module.exports = CouponController;