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
        // required: true
    }],
    dislike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        // required: true
    }],
    Image: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fblog&psig=AOvVaw14FPSlUMvNch3ZPC_jOV4R&ust=1687187015522000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCOi-i8yLzf8CFQAAAAAdAAAAABAE"
    },
    author: {
        type: String,
        default: role.ADMIN
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

//Export the model
module.exports = mongoose.model(modelName.BLOG, blogSchema);