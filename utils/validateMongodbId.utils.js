const { default: mongoose } = require("mongoose");

module.exports = (id, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: 'This id is not valid or not found'
        })
    }
}