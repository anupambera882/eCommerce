const ProductModel = require('../models/product.model');

class ProductService {
    static createNewProduct = async (newProductDetails) => {
        const newProduct = new ProductModel(newProductDetails);
        const newProductSave = await newProduct.save();
        return newProductSave;
    }

    static getProductByPK = async (pk, select = 0) => {
        if (select) {
            const productData = await ProductModel.findOne(pk, select);
            return productData;
        }
        const productData = await ProductModel.findOne(pk);
        return productData;
    }

    static getAllProduct = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const productsData = await ProductModel.find(filter, select).skip(skip).limit(limit);
            return productsData;
        }
        const productsData = await ProductModel.find().skip(skip).limit(limit);
        return productsData;
    }

    static updateProductDetailsById = async (id, updateData) => {
        const updateProductData = await ProductModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateProductData;
    }
}

module.exports = ProductService;