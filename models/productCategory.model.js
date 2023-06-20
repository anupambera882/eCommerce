const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(modelName.PRODUCT_CATEGORY, productCategorySchema);