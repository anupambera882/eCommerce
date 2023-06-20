const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: modelName.PRODUCT
        },
        count: Number,
        color: String,
        price: Number
    }],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(modelName.CART, cartSchema);