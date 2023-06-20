const ColorModel = require("../models/color.model");

class ColorService {
    static createNewColor = async (newColorDetails) => {
        const newColor = new ColorModel(newColorDetails);
        const newColorSave = await newColor.save();
        return newColorSave;
    }

    static getColorByPK = async (pk, select = 0) => {
        if (select) {
            const colorData = await ColorModel.findOne(pk, select);
            return colorData;
        }
        const colorData = await ColorModel.findOne(pk);
        return colorData;
    }

    static getAllColor = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const colorsData = await ColorModel.find(filter, select).skip(skip).limit(limit);
            return colorsData;
        }
        const colorsData = await ColorModel.find().skip(skip).limit(limit);
        return colorsData;
    }

    static updateColorDetailsById = async (id, updateData) => {
        const updateColorData = await ColorModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateColorData;
    }
}

module.exports = ColorService;