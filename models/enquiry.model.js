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
});

//Export the model
module.exports = mongoose.model(modelName.ENQUIRY, enquirySchema);