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

    static getAllProduct = async () => {
        const productsData = await ProductModel.find();
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