const mongoose = require('mongoose');
const { modelName } = require('./AllModelName');

// Declare the Schema of the Mongo model
const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model(modelName.CATEGORY, categorySchema);