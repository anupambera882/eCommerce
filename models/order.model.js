const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const orderStatusCondition = {
    1: 'Not Processed',
    2: 'Cash On Delivery',
    3: 'Processing',
    4: 'Dispatch',
    5: 'Cancelled',
    6: 'Delivered'
}

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: modelName.PRODUCT
        },
        count: Number,
        color: String,
        // price: Number
    }],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: orderStatusCondition[1],
        enum: [orderStatusCondition[1], orderStatusCondition[2], orderStatusCondition[3], orderStatusCondition[4], orderStatusCondition[5], orderStatusCondition[6]]
    },
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(modelName.ORDER, orderSchema);