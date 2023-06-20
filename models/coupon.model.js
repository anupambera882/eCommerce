const mongoose = require('mongoose');
const modelName = require('./AllModelName');

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});


CouponSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});


module.exports = mongoose.model(modelName.COUPON, CouponSchema);