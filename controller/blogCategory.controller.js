const BlogCategoryService = require("../service/blogCategory.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");

class BlogCategoryController {
    static createBlogCategory = async (req, res) => {
        try {
            const { title } = req.body;
            const newBlogCategory = await BlogCategoryService.createNewBlogCategory({ title: title });
            return res.status(201).json({
                success: true,
                message: 'New blog category created successfully',
                category: newBlogCategory
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new blog category",
                errMessage: err.message
            });
        }
    }

    static updateBlogCategory = async (req, res) => {
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
            const updateCategory = await BlogCategoryService.updateBlogCategoryDetailsById(id, { title: title });

            return res.status(201).json({
                success: true,
                message: 'successfully update blog category',
                data: updateCategory
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update blog category",
                errMessage: err.message
            });
        }
    }

    static deleteBlogCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            await BlogCategoryService.updateBlogCategoryDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete blog category'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete blog category",
                errMessage: err.message
            });
        }
    }

    static getBlogCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const blogCategory = await BlogCategoryService.getBlogCategoryByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: blogCategory
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllBlogCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const allCategory = await BlogCategoryService.getAllBlogCategory();

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

module.exports = BlogCategoryController;