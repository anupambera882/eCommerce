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
        type: String,
        enum: [],
        required: true
    },
    brand: {
        type: String,
        required: true,
        enum: ['Apple', 'Samsung']
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        required: true,
        // enum: ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red']
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        required: true
    },
    rating: [{
        star: Number,
        Comment: String,
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
        // required: true,
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


productSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDelete: { $ne: true } });
    next();
});


module.exports = mongoose.model(modelName.PRODUCT, productSchema);