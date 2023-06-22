const BrandService = require("../service/brand.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");

class BrandController {
    static createBrand = async (req, res) => {
        try {
            const { title } = req.body;
            const newBrand = BrandService.createNewBrand({ title: title });

            return res.status(201).json({
                success: true,
                message: 'New Brand  created successfully',
                brand: newBrand
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new brand ",
                errMessage: err.message
            });
        }
    }

    static updateBrand = async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            validateMongodbId(id, res);
            const update = await BrandService.updateBrandDetailsById(id, { title: title });

            return res.status(201).json({
                success: true,
                message: 'successfully update brand',
                data: update
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update brand",
                errMessage: err.message
            });
        }
    }

    static deleteBrand = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            await BrandService.updateBrandDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete brand'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete brand",
                errMessage: err.message
            });
        }
    }

    static getBrandById = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const Brand = await BrandService.getBrandByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: Brand
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllBrand = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const all = await BrandService.getAllBrand();

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

module.exports = BrandController;