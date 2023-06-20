const CouponModel = require('../models/coupon.model');

class CouponService {
    static createNewCoupon = async (newCouponDetails) => {
        const newCoupon = new CouponModel(newCouponDetails);
        const newCouponSave = await newCoupon.save();
        return newCouponSave;
    }

    static getCouponByPK = async (pk, select = 0) => {
        if (select) {
            const couponData = await CouponModel.findOne(pk, select);
            return couponData;
        }
        const couponData = await CouponModel.findOne(pk);
        return couponData;
    }

    static getAllCoupon = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const couponsData = await CouponModel.find(filter, select).skip(skip).limit(limit);
            return couponsData;
        }
        const couponsData = await CouponModel.find().skip(skip).limit(limit);
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