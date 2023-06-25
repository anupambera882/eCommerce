const CouponModel = require('../models/coupon.model');

class CouponService {
    static createNewCoupon = async (newCouponDetails) => {
        const newCoupon = new CouponModel(newCouponDetails);
        const newCouponSave = await newCoupon.save();
        return newCouponSave;
    }

    static getCouponByPk = async (pk) => {
        const coupon = await CouponModel.findOne(pk);
        return coupon;
    }

    static getAllCoupon = async () => {
        const couponsData = await CouponModel.find();
        return couponsData;
    }

    static updateCouponDetailsById = async (id, updateData) => {
        const updateCouponData = await CouponModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateCouponData;
    }
}

module.exports = CouponService;