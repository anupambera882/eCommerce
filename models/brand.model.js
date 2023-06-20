const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(modelName.BRAND, brandSchema);