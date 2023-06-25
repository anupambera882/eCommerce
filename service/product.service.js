const ProductModel = require('../models/product.model');

class ProductService {
    static createNewProduct = async (newProductDetails) => {
        const newProduct = new ProductModel(newProductDetails);
        const newProductSave = await newProduct.save();
        return newProductSave;
    }

    static getProductByPK = async (pk, select = 0) => {
        if (select) {
            const productData = await ProductModel.findOne(pk, select).populate('category', 'title').populate('brand', 'title').populate('color', 'title').exec();
            return productData;
        }
        const productData = await ProductModel.findOne(pk).populate('category', 'title').populate('brand', 'title').populate('color', 'title').exec();
        return productData;
    }

    static getAllProduct = async (filter = 0, skip = 0, limit = 0, select = 0) => {
        if (select) {
            const productsData = await ProductModel.find(filter, select).populate('category', 'title').populate('brand', 'title').populate('color', 'title').skip(skip).limit(limit).exec();
            return productsData;
        }
        const productsData = await ProductModel.find().populate('category', 'title').populate('brand', 'title').populate('color', 'title').exec();
        return productsData;
    }

    static updateProductDetailsById = async (id, updateData) => {
        const updateProductData = await ProductModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        return updateProductData;
    }
}

module.exports = ProductService;