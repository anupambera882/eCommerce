const BlogCategoryService = require("../service/blogCategory.service");

class BlogCategoryController {
    static createBlogCategory = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static updateBlogCategory = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static deleteBlogCategory = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getBlogCategoryById = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getAllBlogCategory = async (req, res) => {
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

module.exports = BlogCategoryController;