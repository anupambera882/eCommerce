const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.PRODUCT_CATEGORY,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.BRAND,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.COLOR,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        required: true
    },
    rating: [{
        star: Number,
        comment: String,
        comment: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: modelName.USER
        },
    }],
    totalRating: {
        type: String,
        default: 0
    },
    discountPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
}, {
    timestamps: true
});


productSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});


module.exports = mongoose.model(modelName.PRODUCT, productSchema);