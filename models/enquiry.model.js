const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');


const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});


enquirySchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model(modelName.ENQUIRY, enquirySchema);