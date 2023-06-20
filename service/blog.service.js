const BlogModel = require("../models/blog.model");

class BlogService {
    static createNewBlog = async (newBlogDetails) => {
        const newBlog = new BlogModel(newBlogDetails);
        const newBlogSave = await newBlog.save();
        return newBlogSave;
    }

    static getBlogByPK = async (pk, select = 0) => {
        if (select) {
            const blogData = await BlogModel.findOne(pk, select);
            return blogData;
        }
        const blogData = await BlogModel.findOne(pk);
        return blogData;
    }

    static getAllBlog = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const blogsData = await BlogModel.find(filter, select).skip(skip).limit(limit);
            return blogsData;
        }
        const blogsData = await BlogModel.find().skip(skip).limit(limit);
        return blogsData;
    }

    static updateBlogDetailsById = async (id, updateData) => {
        const updateBlogData = await BlogModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateBlogData;
    }
}


module.exports = BlogService;