const BlogModel = require("../models/blog.model");

class BlogService {
    static createNewBlog = async (NewBlogDetails) => {
        const newBlog = new BlogModel(NewBlogDetails);
        const newBlogSave = await newBlog.save();
        return newBlogSave;
    }

    static getBlogByPK = async (pk, select = 0) => {
        if (select) {
            const BlogData = await BlogModel.findOne(pk, select);
            return BlogData;
        }
        const BlogData = await BlogModel.findOne(pk);
        return BlogData;
    }

    // static getAllBlog = async (filter, skip, limit, select = 0) => {
    //     if (filter) {
    //         const BlogsData = await BlogModel.find(filter, select).skip(skip).limit(limit);
    //         return BlogsData;
    //     }
    //     const BlogsData = await BlogModel.find().skip(skip).limit(limit);
    //     return BlogsData;
    // }

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