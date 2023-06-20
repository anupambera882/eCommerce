const ProductCategoryModel = require('../models/productCategory.model');

class ProductCategoryService {
    static createNewProductCategory = async (newProductCategoryDetails) => {
        const newProductCategory = new ProductCategoryModel(newProductCategoryDetails);
        const newProductCategorySave = await newProductCategory.save();
        return newProductCategorySave;
    }

    static getProductCategoryByPK = async (pk, select = 0) => {
        if (select) {
            const productCategoryData = await ProductCategoryModel.findOne(pk, select);
            return productCategoryData;
        }
        const productCategoryData = await ProductCategoryModel.findOne(pk);
        return productCategoryData;
    }

    static getAllProductCategory = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const productCategoriesData = await ProductCategoryModel.find(filter, select).skip(skip).limit(limit);
            return productCategoriesData;
        }
        const productCategoriesData = await ProductCategoryModel.find().skip(skip).limit(limit);
        return productCategoriesData;
    }

    static updateProductCategoryDetailsById = async (id, updateData) => {
        const updateProductCategoryData = await ProductCategoryModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateProductCategoryData;
    }
}

module.exports = ProductCategoryService;