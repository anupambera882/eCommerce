const multer = require("multer");

module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else {
        // Other errors
        return res.status(500).json({ error: 'Something went wrong.' });
    }
}