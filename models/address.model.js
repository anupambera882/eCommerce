const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

const AddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelName.USER,
        required: true,
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});

AddressSchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model(modelName.ADDRESS, AddressSchema);