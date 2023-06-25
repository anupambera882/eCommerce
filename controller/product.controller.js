const ProductCategoryService = require("../service/productCategory.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");
const ProductService = require("../service/product.service");
const BrandService = require("../service/brand.service");
const ColorService = require("../service/color.service");
const UserService = require("../service/user.service");
// const { deleteFile } = require("../utils/deleteFile.util");


class ProductController {

    static createNewProduct = async (req, res) => {
        try {
            const { title, description, price, quantity } = req.body;
            let { category, brand, color } = req.body;
            let { thumbnail, images } = req.files;
            thumbnail = `${thumbnail[0].destination}\\products\\${thumbnail[0].filename.replace(/\.[^/.]+$/, '.jpeg')}`;
            let imagePath = [];
            images.forEach((image) => {
                imagePath.push(`${image.destination}\\products\\${image.filename.replace(/\.[^/.]+$/, '.jpeg')}`);
            });

            let { slug } = req.body;
            // Check duplicate slag 
            if (slug === undefined) {
                slug = title.toLowerCase().split(" ").join("-");
                const productData = await ProductService.getProductByPK({ slug: slug });
                if (productData) {
                    return res.status(400).json({
                        success: false,
                        message: "Please Enter your slag manually"
                    })
                }
                req.body.slug = slug;
            } else {
                const productData = await ProductService.getProductByPK({ slug: slug });
                if (productData) {
                    return res.status(400).json({
                        success: false,
                        message: "Please Enter Another slag , Your enter slag is already exist"
                    })
                }
            }

            category = await ProductCategoryService.getProductCategoryByPK({ title: category });
            brand = await BrandService.getBrandByPK({ title: brand });
            color = await ColorService.getColorByPK({ title: color });


            const newProduct = {
                title: title,
                slug: req.body.slug,
                description: description,
                price: price,
                category: category._id,
                brand: brand._id,
                quantity: quantity,
                color: color._id,
                sellerId: req.user.userId,
                thumbnail: thumbnail,
                images: imagePath
            }
            const newProductSave = await ProductService.createNewProduct(newProduct);

            return res.status(201).json({
                success: true,
                successMessage: "Product register successfully",
                newProduct: newProductSave
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to add new product",
                errMessage: err.message
            });
        }
    }

    static updateProductById = async (req, res) => {
        try {
            const { productId } = req.params;
            let { title, slug } = req.body;
            const valid = validateMongodbId(productId);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            if (title) {
                if (slug === undefined) {
                    slug = title.toLowerCase().split(" ").join("-");
                    const productData = await ProductService.getProductByPK({ slug: slug });
                    if (productData) {
                        return res.status(400).json({
                            success: false,
                            message: "Please Enter your slag manually"
                        })
                    }
                    req.body.slug = slug;
                } else {
                    const productData = await ProductService.getProductByPK({ slug: slug });
                    if (productData) {
                        return res.status(400).json({
                            success: false,
                            message: "Please Enter Another slag , Your enter slag is already exist"
                        })
                    }
                }
            }

            const productSellerId = await ProductService.getProductByPK({ _id: productId }, { sellerId: 1 });

            if (req.user.userId.toString() !== productSellerId.sellerId.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not the owner in this product'
                });
            }

            if (req.body.category) {
                const category = await ProductCategoryService.getProductCategoryByPK({ title: category });
                req.body.category = category._id;
            }
            if (req.body.brand) {
                const brand = await BrandService.getBrandByPK({ title: brand });
                req.body.brand = brand._id;
            }
            if (req.body.color) {
                const color = await ColorService.getColorByPK({ title: color });
                req.body.color = color._id;
            }

            const product = await ProductService.updateProductDetailsById(productId, req.body);

            return res.status(201).json({
                success: true,
                product: product
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to update product details",
                errMessage: err.message
            });
        }
    }

    static getAllProducts = async (req, res) => {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const { category, brand, color, rating, discountPercentage, title } = req.query;

            const filter = {};
            const skip = (page - 1) * limit;

            if (title) { filter.title = title; }
            if (category) { filter.category = category; }
            if (brand) { filter.brand = brand; }
            if (color) { filter.color = color; }
            if (rating) { filter.rating = rating; }
            if (discountPercentage) { filter.discountPercentage = discountPercentage; }
            const products = await ProductService.getAllProduct(filter, skip, limit, { _id: 1, title: 1, slug: 1, description: 1, price: 1, category: 1, brand: 1, color: 1, discountPercentage: 1, thumbnail: 1, images: 1 });

            return res.status(200).json({
                success: true,
                products: products
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can't get product",
                errMessage: err.message
            });
        }
    };

    static getProductById = async (req, res) => {
        try {
            const { productId } = req.params;
            const valid = validateMongodbId(productId);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const product = await ProductService.getProductByPK({ _id: productId });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                    errMessage: err.message
                });
            }
            return res.status(200).json({
                success: true,
                product: product
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to get product",
                errMessage: err.message
            });
        }
    }

    static deleteProductById = async (req, res) => {
        try {
            const { productId } = req.params;
            const valid = validateMongodbId(productId);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const productSellerId = await ProductService.getProductByPK({ _id: productId }, { sellerId: 1 });
            if (req.user.userId.toString() !== productSellerId.sellerId.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not the owner in this product'
                });
            }
            const product = await ProductService.updateProductDetailsById(productId, { isDeleted: true });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            return res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to delete product",
                errMessage: err.message
            });
        }
    }

    static addToWishList = async (req, res) => {
        try {
            const { userId } = req.user;
            const { productId } = req.body;
            const valid = validateMongodbId(productId);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const user = await UserService.getUserByPK({ _id: userId });

            const alreadyAdded = user.wishList.find((id) => {
                id.toString() === productId
            })

            if (alreadyAdded) {
                await UserService.updateUserDetailsById(userId, { $pull: { wishList: productId } });
                return res.json({
                    success: true,
                    message: 'product remove successfully'
                });
            }

            await UserService.updateUserDetailsById(userId, { $push: { wishList: productId } });
            return res.json({
                success: true,
                message: 'product remove successfully'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to modify product",
                errMessage: err.message
            });
        }
    }

    static rating = async (req, res) => {
        try {
            const { userId } = req.user;
            const { star, productId, comment } = req.body;
            const valid = validateMongodbId(productId);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const product = await ProductService.getProductByPK({ _id: productId });

            let alreadyRated = product.rating.find((userId) => {
                userId.postedBy.toString() === userId.toString()
            });

            if (alreadyRated) {
                const updateRating = await ProductService.updateProductDetailsById(productId, { $set: { 'rating.$.star': star, 'rating.$.comment': comment } })

                return res.json({
                    success: true,
                    updateRating: updateRating
                })
            }

            await ProductService.updateProductDetailsById(productId, { $push: { rating: { star: star, comment: comment, postedBy: userId } } });
            const getAllRating = await ProductService.getProductByPK({ _id: productId });

            let totalRating = getAllRating.rating.length;
            let ratingSum = getAllRating.rating
                .map((item) => item.star)
                .reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingSum / totalRating);
            let finalProduct = ProductService.updateProductDetailsById(productId, { $set: { totalRating: actualRating } });

            return res.status(200).json({
                success: true,
                finalProduct: finalProduct
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to modify product",
                errMessage: err.message
            });
        }
    }
}

module.exports = ProductController;