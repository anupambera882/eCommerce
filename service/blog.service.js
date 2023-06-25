const BlogModel = require("../models/blog.model");

class BlogService {
    static createNewBlog = async (newBlogDetails) => {
        const newBlog = new BlogModel(newBlogDetails);
        const newBlogSave = await newBlog.save();
        return newBlogSave;
    }

    static getBlogByPK = async (pk, populate = 0) => {
        if (populate) {
            const blogData = await BlogModel.findOne(pk).populate({ path: 'likes', select: '-_id email' }).populate({ path: 'dislikes', select: '-_id email' }).populate({ path: 'category', select: '-_id title' });
            return blogData;
        }
        const blogData = await BlogModel.findOne(pk);
        return blogData;
    }

    static getAllBlog = async (filter = 0, select = 0) => {
        if (select) {
            const blogsData = await BlogModel.find(filter, select).populate({ path: 'likes', select: '-_id email' }).populate({ path: 'dislikes', select: '-_id email' }).populate({ path: 'category', select: '-_id title' });
            return blogsData;
        }
        const blogsData = await BlogModel.find().populate({ path: 'likes', select: '-_id email' }).populate({ path: 'dislikes', select: '-_id email' }).populate({ path: 'category', select: '-_id title' });
        return blogsData;
    }

    static updateBlogDetailsById = async (id, updateData) => {
        const updateBlogData = await BlogModel.findByIdAndUpdate(id, updateData,
            {
                new: true
            });
        return updateBlogData;
    }
}


module.exports = BlogService;