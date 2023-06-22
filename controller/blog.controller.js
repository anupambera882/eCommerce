const { UserModel } = require("../models/user.model");
const BlogService = require("../service/blog.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");

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
                message: "Unable to add new blog",
                errMessage: err.message
            });
        }
    }

    static updateBlog = async (req, res) => {
        try {
            const { blogId } = req.params;
            validateMongodbId(blogId, res);
            const updateBlogData = await BlogService.updateBlogDetailsById(blogId, { $set: req.body });
            return res.status(201).json({
                success: true,
                successMessage: "New blog update successfully",
                data: {
                    updateBlogData
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update blog",
                errMessage: err.message
            });
        }
    }

    static getBlog = async (req, res) => {
        try {
            const { blogId } = req.params;
            validateMongodbId(blogId, res)
            await BlogService.updateBlogDetailsById(blogId, { $inc: { numViews: 1 } });
            const blog = await BlogService.getBlogByPK({ _id: blogId },1);

            return res.status(200).json({
                success: true,
                blog: blog
            });
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
            const blogs = await BlogService.getAllBlog();
            return res.status(200).json({
                success: true,
                blogs: blogs
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to get blogs",
                errMessage: err.message
            });
        }
    }

    static deleteBlog = async (req, res) => {
        try {
            const { blogId } = req.params;
            validateMongodbId(blogId, res);
            const blog = BlogService.updateBlogDetailsById(blogId, { $set: { isDeleted: true } });

            return res.status(201).json({
                success: true,
                message: 'Successfully delete blog',
                blog: blog
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete blog",
                errMessage: err.message
            });
        }
    }

    static likeBlog = async (req, res) => {
        try {
            const { blogId } = req.body;
            validateMongodbId(blogId);

            // Find the blog which you want to like
            const blog = await BlogService.getBlogByPK({ _id: blogId });
            // find the login user
            const loginUserId = req.user.userId;
            // find if the user has like the blog
            const isLiked = blog.isLike;
            // find if the user has dislike the blog
            const alreadyDisliked = blog.dislikes.find(
                (userId = userId.toString() === loginUserId.toString())
            );

            if (alreadyDisliked) {
                await BlogService.updateBlogDetailsById(blogId, { $pull: { dislikes: loginUserId }, isDislike: false });
            }

            if (isLiked) {
                await BlogService.updateBlogDetailsById(blogId, { $pull: { likes: loginUserId }, isLike: false });
                return res.sendStatus(200);
            }

            await BlogService.updateBlogDetailsById(blogId, { $push: { likes: loginUserId }, isLike: true });

            return res.status(201).json({
                success: true,
                message: 'Blog like successfully'
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to update",
                errMessage: err.message
            });
        }
    }

    static dislikeBlog = async (req, res) => {
        try {
            const { blogId } = req.body;
            validateMongodbId(blogId);

            // Find the blog which you want to dislike
            const blog = await BlogService.getBlogByPK({ _id: blogId });
            // find the login user
            const loginUserId = req.user.userId;
            // find if the user has Dislike the blog
            const isDisliked = blog.isDislike;
            // find if the user has like the blog
            const alreadyLiked = blog.likes.find(
                (userId = userId.toString() === loginUserId.toString())
            );

            if (alreadyLiked) {
                await BlogService.updateBlogDetailsById(blogId, { $pull: { likes: loginUserId }, isLike: false });
            }

            if (isDisliked) {
                await BlogService.updateBlogDetailsById(blogId, { $pull: { dislikes: loginUserId }, isDislike: false });
                return res.sendStatus(200);
            }

            await BlogService.updateBlogDetailsById(blogId, { $push: { dislikes: loginUserId }, isDislike: true });

            return res.status(201).json({
                success: true,
                message: 'Blog DisLike successfully'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to update",
                errMessage: err.message
            });
        }
    }
}

module.exports = BlogController;