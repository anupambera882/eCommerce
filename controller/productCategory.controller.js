const ProductCategoryService = require("../service/productCategory.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");

class ProductCategoryController {
    static createProductCategory = async (req, res) => {
        try {
            const { title } = req.body;
            const newProductCategory = await ProductCategoryService.createNewProductCategory({ title: title });

            return res.status(201).json({
                success: true,
                message: 'New product category created successfully',
                category: newProductCategory
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new product category",
                errMessage: err.message
            });
        }
    }

    static updateProductCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            validateMongodbId(id, res);
            const updateCategory = await ProductCategoryService.updateProductCategoryDetailsById(id, { title: title });

            return res.status(201).json({
                success: true,
                message: 'successfully update product category',
                data: updateCategory
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update product category",
                errMessage: err.message
            });
        }
    }

    static deleteProductCategory = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            await ProductCategoryService.updateProductCategoryDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete product category'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete product category",
                errMessage: err.message
            });
        }
    }

    static getProductCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const productCategory = await ProductCategoryService.getProductCategoryByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: productCategory
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllProductCategory = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const allCategory = await ProductCategoryService.getAllProductCategory();

            return res.status(201).json({
                success: true,
                data: allCategory
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

module.exports = ProductCategoryController;