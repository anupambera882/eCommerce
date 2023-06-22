const ProductCategoryService = require("../service/productCategory.service");

class ProductCategoryController {
    static createProductCategory = async (req, res) => {
        try {
            
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static updateProductCategory = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static deleteProductCategory = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getProductCategoryById = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getAllProductCategory = async (req, res) => {
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

module.exports = ProductCategoryController;