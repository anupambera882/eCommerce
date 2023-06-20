const mongoose = require('mongoose');
const { role } = require('./user.model');
const { modelName } = require('./AllModelName');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0,
        required: true
    },
    isLike: {
        type: Boolean,
        default: false,
        required: true
    },
    isDislike: {
        type: Boolean,
        default: false,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        required: true
    }],
    dislike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        required: true
    }],
    Image: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        default: role.ADMIN
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});


blogSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});


//Export the model
module.exports = mongoose.model(modelName.BLOG, blogSchema);