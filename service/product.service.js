const ProductModel = require('../models/product.model');

class ProductService {
    static createNewProduct = async (NewProductDetails) => {
        const newProduct = new ProductModel(NewProductDetails);
        const newProductSave = await newProduct.save();
        return newProductSave;
    }

    static getProductByPK = async (pk, select = 0) => {
        if (select) {
            const ProductData = await ProductModel.findOne(pk, select);
            return ProductData;
        }
        const ProductData = await ProductModel.findOne(pk);
        return ProductData;
    }

    static getAllProduct = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const ProductsData = await ProductModel.find(filter, select).skip(skip).limit(limit);
            return ProductsData;
        }
        const ProductsData = await ProductModel.find().skip(skip).limit(limit);
        return ProductsData;
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