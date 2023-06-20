const ColorService = require("../service/color.service");

class ColorController {
    static createColor = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static updateColor = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static deleteColor = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getColorById = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getAllColor = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }
}

module.exports = ColorController;