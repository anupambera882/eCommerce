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
    }
});


module.exports = mongoose.model(modelName.ADDRESS, AddressSchema);