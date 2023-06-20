const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});


productCategorySchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});


module.exports = mongoose.model(modelName.PRODUCT_CATEGORY, productCategorySchema);