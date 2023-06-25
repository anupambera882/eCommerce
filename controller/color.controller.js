const ColorService = require("../service/color.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");

class ColorController {
    static createColor = async (req, res) => {
        try {
            const { title } = req.body;
            const newColor = await ColorService.createNewColor({ title: title });

            return res.status(201).json({
                success: true,
                message: 'New Color  created successfully',
                Color: newColor
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new color ",
                errMessage: err.message
            });
        }
    }

    static updateColor = async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const update = await ColorService.updateColorDetailsById(id, { title: title });

            return res.status(201).json({
                success: true,
                message: 'successfully update color',
                data: update
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update color",
                errMessage: err.message
            });
        }
    }

    static deleteColor = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            await ColorService.updateColorDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete color'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete color",
                errMessage: err.message
            });
        }
    }

    static getColorById = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const Color = await ColorService.getColorByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: Color
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllColor = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const all = await ColorService.getAllColor();

            return res.status(201).json({
                success: true,
                data: all
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }
}

module.exports = ColorController;