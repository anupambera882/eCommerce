const ProductService = require("../service/product.service");
const { deleteFile } = require("../utils/deleteFile.util");

class ProductController {

    static createNewProduct = async (req, res) => {
        try {
            const { title, description, price, brand, quantity, color } = req.body;
            let { slug } = req.body;
            let { thumbnail, images } = req.files;
            thumbnail = thumbnail[0].path;
            images.forEach((image) => {
                image.push(image.path);
            });

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
            } else {
                const productData = await ProductService.getProductByPK({ slug: slug });
                if (productData) {
                    return res.status(400).json({
                        success: false,
                        message: "Please Enter Another slag , Your enter slag is already exist"
                    })
                }
            }

            const newProduct = {
                title: title,
                slug: slug,
                description: description,
                price: price,
                category: category,
                brand: brand,
                quantity: quantity,
                color: color,
                sellerId: req.user.userId,
                thumbnail: thumbnail,
                images: images
            }
            const newProductSave = await ProductService.createNewProduct(newProduct);

            return res.status(201).json({
                success: true,
                successMessage: "Product register successfully",
                data: {
                    id: newProductSave._id,
                    title: newProductSave.title,
                    slug: newProductSave.slug,
                    description: newProductSave.description,
                    price: newProductSave.price,
                    brand: newProductSave.brand,
                    quantity: newProductSave.quantity,
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to add new data",
                message: "",
                errMessage: err.message
            });
        }
    }

    static updateProductById = async (req, res) => {
        try {
            const { productId } = req.params;
            let { title, slug } = req.body;

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

            if (req.user.userId !== productSellerId.sellerId) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not the owner in this product'
                });
            }

            const product = await ProductService.updateProductDetailsById(productId, req.body);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

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
            const page = query.params.page || 1;
            const limit = query.query.limit || 10;
            const { category, brand, price, color, rating, discountPercentage, title } = req.query;

            const filter = {};
            const skip = (page - 1) * limit;

            if (title) { filter.title = title; }
            if (category) { filter.category = category; }
            if (brand) { filter.brand = brand; }
            if (color) { filter.color = color; }
            if (rating) { filter.rating = rating; }
            if (discountPercentage) { filter.discountPercentage = discountPercentage; }
            const products = await ProductService.getAllProduct(filter, skip, limit, { _id: 1, title: 1, slug: 1, description: 1, price: 1, category: 1, brand: 1, color: 1, discountPercentage: 1, thumbnail: 1 });

            return res.status(200).json({
                success: true,
                products: products
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                errMessage: err.message
            });
        }
    };

    static getProductById = async (req, res) => {
        try {
            const { productId } = req.params;
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
            const productSellerId = await ProductService.getProductByPK({ _id: productId }, { sellerId: 1 });
            if (req.user.userId !== productSellerId.sellerId) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not the owner in this product'
                });
            }

            const product = await ProductService.updateProductDetailsById(productId, { isDelete: true });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            product.images.forEach(async (image) => {
                await deleteFile(image);
            });
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

        } catch (err) {
            return res.status(500).json({

            });
        }
    }

    static rating = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({

            });
        }
    }
}

module.exports = ProductController;