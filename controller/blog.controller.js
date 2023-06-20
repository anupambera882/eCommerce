const { UserModel } = require("../models/user.model");
const BlogService = require("../service/blog.service");

class BlogController {
    static createBlog = async (req, res) => {
        try {
            const { title, description, category } = req.body;
            const newBlog = {
                title: title,
                description: description,
                category: category
            }

            const newBlogSave = await BlogService.createNewBlog(newBlog);

            return res.status(201).json({
                success: true,
                successMessage: "New blog save successfully",
                data: {
                    newBlogSave
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to save",
                errMessage: err.message
            });
        }
    }

    static updateBlog = async (req, res) => {
        try {
            const { blogId } = req.params;
            const updateBlogData = await BlogService.updateBlogDetailsById(blogId, req.body);
            return res.status(201).json({
                success: true,
                successMessage: "New blog save successfully",
                data: {
                    updateBlogData
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getBlog = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static getAllBlog = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }


    static deleteBlog = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static likeTheBlog = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "",
                errMessage: err.message
            });
        }
    }

    static dislikeTheBlog = async (req, res) => {
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

module.exports = BlogController;