class BaseController {
    constructor(success, message, data, statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    static sendResponse(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data
        });
    }
}

module.exports = BaseController;
