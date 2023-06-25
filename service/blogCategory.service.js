const BlogCategoryModel = require('../models/blogCategory.model');

class BlogCategoryService {
    static createNewBlogCategory = async (newBlogCategoryDetails) => {
        const newBlogCategory = new BlogCategoryModel(newBlogCategoryDetails);
        const newBlogCategorySave = await newBlogCategory.save();
        return newBlogCategorySave;
    }

    static getBlogCategoryByPK = async (pk, select = 0) => {
        if (select) {
            const blogCategoryData = await BlogCategoryModel.findOne(pk, select);
            return blogCategoryData;
        }
        const blogCategoryData = await BlogCategoryModel.findOne(pk);
        return blogCategoryData;
    }

    static getAllBlogCategory = async () => {
        const blogCategoriesData = await BlogCategoryModel.find();
        return blogCategoriesData;
    }

    static updateBlogCategoryDetailsById = async (id, updateData) => {
        const updateBlogCategoryData = await BlogCategoryModel.findByIdAndUpdate(id, { $set: updateData },
            {
                new: true
            });
        return updateBlogCategoryData;
    }
}

module.exports = BlogCategoryService;