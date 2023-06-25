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
    status: {
        type: String,
        default: 'Submitted',
        enum: ['Submitted', 'contacted', 'In progress']
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});


enquirySchema.pre(/^find/, function (next) {
    // Exclude soft-deleted products
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model(modelName.ENQUIRY, enquirySchema);