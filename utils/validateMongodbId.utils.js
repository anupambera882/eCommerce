const { default: mongoose } = require("mongoose");

module.exports = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        return false;
    }
    return true;
}