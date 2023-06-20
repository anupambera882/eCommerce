const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const colorSchema = new mongoose.Schema({
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


colorSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});


module.exports = mongoose.model(modelName.COLOR, colorSchema);