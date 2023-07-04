const uniqid = require('uniqid');
const { generateToken, verifyToken } = require('../config/jwt.config');
const validateMongodbId = require('../utils/validateMongodbId.utils');
const CouponService = require('../service/coupon.service');
const { transporter } = require('../config/email.config');
const ProductModel = require('../models/product.model');
const UserService = require('../service/user.service');
const OrderModel = require('../models/order.model');
const CartModel = require('../models/cart.model');
const { role } = require('../models/user.model');
const BaseController = require('./base.controller');
const refreshTokenMaxSize = 5;
const oneDay = 1000 * 60 * 60 * 24;

class UserController extends BaseController {
    constructor(success, message, data, statusCode) {
        super(success, message, data, statusCode);
    }
    static createUser = async (req, res) => {
        try {
            const { firstName, lastName, email, mobile, password, role } = req.body;

            // check duplicate user entry
            const checkEmail = await UserService.getUserByPK({ email: email });
            const checkPhone = await UserService.getUserByPK({ mobile: mobile });
            if (checkEmail || checkPhone) {
                return res.status(400).json({
                    status: false,
                    errorMessage: "user already exist"
                });
            }

            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                mobile: mobile,
                password: password
            }
            if (role) {
                newUser.role = role
            }
            const newUserSave = await UserService.createNewUser(newUser);
            const refreshToken = await generateToken({ id: newUserSave._id }, process.env.REFRESH_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_EXPIRATION_TIME);
            await UserService.updateUserDetailsById(newUserSave._id, { $push: { refreshToken: refreshToken } });

            // Not necessary to await for this mail send 
            transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: newUserSave.email,
                subject: "welcome to mycommerce",
                html: `<h1> Thank You for register in mycommerce</h1>`
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 365 * oneDay),
                path: '/',
            });

            this.statusCode = 201;
            this.success = true;
            this.message = "User register successfully";
            this.data = newUserSave;
            this.sendResponse(res);
        } catch (err) {
            this.statusCode = 500;
            this.success = false;
            this.message = err.message;
            this.data = {};
            BaseController.sendResponse(res);
        }
    };

    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            let userData;
            if (email && password) {
                userData = await UserService.getUserByPK({ email: email });;
            }
            if (!(userData && (await userData.isPasswordMatch(password)))) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "Invalid credentials"
                })
            }

            if (userData.refreshToken.length >= refreshTokenMaxSize) {
                await UserService.updateUserDetailsById(userData.id, { $pull: { refreshToken: userData.refreshToken[0] } });
            }
            // Create a refreshToken token and update in db
            const refreshToken = await generateToken({ id: userData._id }, process.env.REFRESH_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_EXPIRATION_TIME);
            await UserService.updateUserDetailsById(userData.id, { $push: { refreshToken: refreshToken } });
            // Create a access token 
            const accessToken = await generateToken({ userId: userData.id, email: userData.email, mobile: userData.mobile, role: userData.role, isBlocked: userData.isBlocked }, process.env.ACCESS_TOKEN_SECRET_KEY, process.env.ACCESS_TOKEN_EXPIRATION_TIME);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 365 * oneDay),
                path: '/',
            });
            return res.status(202).json({
                success: true,
                message: "User login successfully",
                accessToken: accessToken,
                data: {
                    id: userData._id,
                    email: userData.email,
                    mobile: userData.mobile
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to Login",
                errMessage: err.message
            });
        }
    }

    static handleRefreshToken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "No refresh token in cookie or Invalid refresh token"
                });
            }
            const { id } = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            const userData = await UserService.getUserByPK({ _id: id });
            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token information"
                });
            }

            const checkRefreshToken = userData.refreshToken.includes(refreshToken)
            if (!checkRefreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid information"
                });
            }

            const accessToken = await generateToken({ userId: userData.id, email: userData.email, mobile: userData.mobile, role: userData.role, isBlocked: userData.isBlocked }, process.env.ACCESS_TOKEN_SECRET_KEY, process.env.ACCESS_TOKEN_EXPIRATION_TIME);

            return res.status(202).json({
                success: true,
                accessToken: accessToken
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to create access token",
                errMessage: err.message
            });
        }
    }

    static logoutUser = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "No refresh token in cookie"
                });
            }

            const { id } = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            const userData = await UserService.getUserByPK({ _id: id });

            if (!userData) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    path: '/'
                });
                return res.sendStatus(204);
            }

            await UserService.updateUserDetailsById(userData._id, { $pull: { refreshToken: refreshToken } });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                path: '/'
            });
            return res.sendStatus(204);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to logout your account",
                errMessage: err.message
            });
        }
    }

    static logoutAllUser = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "No refresh token in cookie"
                });
            }

            const { id } = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            const userData = await UserService.getUserByPK({ _id: id });

            if (!userData) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    path: '/'
                });
                return res.sendStatus(204);
            }

            await UserService.updateUserDetailsById(userData._id, { $set: { refreshToken: [] } });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                path: '/'
            });
            return res.sendStatus(204);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to logout your account",
                errMessage: err.message
            });
        }
    }


    static updateUserDetailsById = async (req, res) => {
        const { userId } = req.user;
        try {
            const userData = await UserService.getUserByPK({ _id: userId });
            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }
            const userUpdateData = await UserService.updateUserDetailsById(userId, { $set: req.body });
            return res.status(202).json({
                success: true,
                message: "User details successfully updated",
                data: {
                    id: userUpdateData.userId,
                    firstName: userUpdateData.firstName,
                    lastName: userUpdateData.lastName,
                    email: userUpdateData.email,
                    mobile: userUpdateData.mobile
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to update details",
                errMessage: err.message
            });
        }
    }

    static changeUserPassword = async (req, res) => {
        try {
            const { password, newPassword } = req.body;
            const userData = await UserService.getUserByPK({ _id: req.user.userId });
            if (!password || !newPassword || !userData || !(await userData.isPasswordMatch(password))) {
                return res.status(401).json({
                    success: false,
                    message: "You enter wrong password"
                });
            }

            await UserService.updateUserDetailsById(userData.id, { $set: { password: newPassword, refreshToken: [] } });
            return res.status(201).json({
                success: true,
                message: "Password changed successfully"
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to update password",
                errMessage: err.message
            });
        }
    }

    static sendUserPasswordResetEmail = async (req, res) => {
        try {
            const { email } = req.body
            const userData = await UserService.getUserByPK({ email: email });
            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: "Email doesn't exists"
                });
            }
            const newSecret = userData._id + process.env.ACCESS_TOKEN_SECRET_KEY;
            const token = await generateToken({ userId: userData._id }, newSecret, '15m');
            const link = `http://127.0.0.1:${process.env.PORT}/api/user/reset-password/${userData._id}/${token}`;
            console.log(link);
            // Send Email
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userData.email,
                subject: "mycommerce - Password Reset Link",
                html: `<a href=${link}>Click Here</a> to Reset Your Password`
            })
            return res.status(200).json({
                success: true,
                message: "Password Reset Email Sent... Please Check Your Email"
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to send Email",
                errMessage: err.message
            })
        }
    }

    static userPasswordReset = async (req, res) => {
        const { password } = req.body;
        const { id, token } = req.params;
        const valid = validateMongodbId(id);
        if (!valid) {
            return res.status(400).json({
                "success": false,
                "message": "This id is not valid or not found"
            })
        }
        const user = await UserService.getUserByPK({ _id: id });
        const newSecret = user._id + process.env.ACCESS_TOKEN_SECRET_KEY;
        try {
            await verifyToken(token, newSecret);
            if (!password) {
                return res.status(401).json({
                    success: false,
                    message: "All Fields are Required"
                });
            }
            await UserService.updateUserDetailsById(user._id, { $set: { password: password } });
            await UserService.updateUserDetailsById(user._id, { $set: { refreshToken: [] } });
            return res.status(401).json({
                success: true,
                "message": "Password Reset Successfully"
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                "message": "Invalid Token",
                errorMessage: err.message
            })
        }
    }

    static deleteUserAccount = async (req, res) => {
        const { email, password } = req.body;
        const { userId } = req.user;
        try {
            const userData = await UserService.getUserByPK({ _id: userId });

            if (!userData || userData.isDeleted === true || userData.email !== email || !(await userData.isPasswordMatch(password))) {
                return res.status(404).json({
                    success: false,
                    errMessage: 'Requested user does not exist or already deleted or invalid email and password'
                });
            }
            await UserService.updateUserDetailsById(userId, { $set: { isDeleted: true } });
            const token = await generateToken({ userId: userData._id }, process.env.ACCESS_TOKEN_SECRET_KEY, '3d');
            const link = `http://127.0.0.1:${process.env.PORT}/api/user/reactive-Deleted-account/${token}`;
            console.log(link);
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userData.email,
                subject: "mycommerce - Reactive Account Link",
                html: `<a href=${link}>Click Here</a> to Reactive Your Account Within 72 hours`
            });

            await UserService.updateUserDetailsById(userData._id, { $set: { refreshToken: [] } });
            res.status(200).json({
                success: true,
                message: "Successfully deleted Account",
                data: {
                    email: userData.email,
                    mobile: userData.mobile,
                    role: userData.role
                }
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: "Invalid credentials",
                errMessage: err.message
            });
        }
    }

    static reactiveDeleteUser = async (req, res) => {
        const { email, password } = req.body;
        const { token } = req.params;
        try {
            const { userId } = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            let userData;
            if (email && password) {
                userData = await UserService.getUserByPK({ _id: userId, isDeleted: true });
            }

            if (!userData || !(await userData.isPasswordMatch(password)) || userData.email !== email || userData.isDeleted === true) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            await UserService.updateUserDetailsById(userId, { $set: { isDeleted: false } });
            return res.status(401).json({
                success: true,
                message: 'You are successfully reactive your account',
                data: {
                    email: userData.email,
                    mobile: userData.mobile,
                    role: userData.role
                }
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static blockAUser = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const user = await UserService.getUserByPK({ _id: id });
            if (user.isBlocked === true) {
                return res.json({
                    success: false,
                    message: 'User already blocked'
                });
            }
            await UserService.updateUserDetailsById(id, { $set: { isBlocked: true } });

            return res.status(200).json({
                success: true,
                message: 'user account block successfully'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to block user Account",
                errMessage: err.message
            });
        }
    }

    static unblockAUser = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }

            const user = await UserService.getUserByPK({ _id: id });
            if (user.isBlocked === false) {
                return res.json({
                    success: false,
                    message: 'User already unblock'
                });
            }
            await UserService.updateUserDetailsById(id, { $set: { isBlocked: false } });

            return res.status(200).json({
                success: true,
                message: 'user account unblock successfully'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unblock user Account",
                errMessage: err.message
            });
        }
    }

    static getAUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const user = await UserService.getUserByPK({ _id: id });
            if (!user) {
                return res.sendStatus(204);
            }
            return res.status(201).json({
                success: true,
                user: user
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static getAllUser = async (req, res) => {
        try {
            const allUser = await UserService.getAllUser();
            return res.status(200).json({
                success: true,
                allUser: allUser
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to fetch user details",
                errMessage: err.message
            });
        }
    }

    static getWishList = async (req, res) => {
        try {
            const { userId } = req.user;
            const user = await UserService.getUserByPK({ _id: userId }, 1);

            return res.status(202).json({
                success: true,
                data: user
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static loginAdmin = async (req, res) => {
        try {
            const { email, password } = req.body;
            let admin;
            if (email && password) {
                admin = await UserService.getUserByPK({ email: email });;
            }
            if (!admin || !(await admin.isPasswordMatch(password)) || (admin.role !== role.ADMIN)) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "Invalid credentials"
                })
            }

            if (admin.refreshToken.length >= refreshTokenMaxSize) {
                await UserService.updateUserDetailsById(admin.id, { $pull: { refreshToken: admin.refreshToken[0] } });
            }
            // Create a refreshToken token and update in db
            const refreshToken = await generateToken({ id: admin._id }, process.env.REFRESH_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_EXPIRATION_TIME);
            await UserService.updateUserDetailsById(admin.id, { $push: { refreshToken: refreshToken } });
            // Create a access token 
            const accessToken = await generateToken(
                { userId: admin.id, email: admin.email, mobile: admin.mobile, role: admin.role },
                process.env.ACCESS_TOKEN_SECRET_KEY, process.env.ACCESS_TOKEN_EXPIRATION_TIME);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 365 * oneDay),
                path: '/',
            });
            return res.status(202).json({
                success: true,
                message: "admin login successfully",
                accessToken: accessToken,
                data: {
                    id: admin._id,
                    email: admin.email,
                    mobile: admin.mobile
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to Login",
                errMessage: err.message
            });
        }
    }

    static userCart = async (req, res) => {
        try {
            const { cart } = req.body;
            const { userId } = req.user;

            let products = [];
            const user = await UserService.getUserByPK({ _id: userId });

            const alreadyExistCart = await CartModel.findOne({ orderBy: user._id });

            if (alreadyExistCart) {
                alreadyExistCart.remove();
            }

            for (let i = 0; i < cart.length; i++) {
                const object = {};
                object.product = cart[i]._id;
                object.count = cart[i].count;
                object.color = cart[i].color;
                let getPrice = await ProductModel.findById(cart[i]._id).select('price').exec();
                object.price = getPrice.price;
                products.push(object);
            }

            let cartTotal = 0;
            for (let i = 0; i < products.length; i++) {
                cartTotal = cartTotal + products[i].price * products[i].count;
            }

            let newCart = await new CartModel({
                products,
                cartTotal,
                orderBy: user._id,
            }).save();

            res.json(newCart);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static getUserCart = async (req, res) => {
        try {
            const { userId } = req.user;
            const cart = await CartModel.findOne({ orderBy: userId }).populate('products.product');
            res.json(cart);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static emptyCart = async (req, res) => {
        try {
            const { userId } = req.user;
            const user = UserService.getUserByPK({ _id: userId })
            const cart = await CartModel.findOneAndRemove({ orderBy: userId });
            res.json(cart);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static applyCoupon = async (req, res) => {
        try {
            const { coupon } = req.body;
            const { userId } = req.user;
            const validCoupon = await CouponService.getCouponByPk({ name: coupon })
            if (validCoupon === null) {
                return res.json({
                    success: false,
                    message: 'invalid coupon'
                });
            }
            const user = await UserService.getUserByPK({ _id: userId });
            let { cartTotal } = await CartModel.findOne({ orderBy: userId }).populate('products.product');
            let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
            await CartModel.findOneAndUpdate(
                { orderBy: userId },
                { totalAfterDiscount },
                { new: true }
            );
            res.json(totalAfterDiscount);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static createOrder = async (req, res) => {
        try {
            const { COD, couponApplied } = req.body;
            const { userId } = req.user;
            if (!COD) {
                return res.json({
                    success: false,
                    message: 'created cash order failed'
                });
            }
            await UserService.getUserByPK({ _id: userId });
            let userCart = await CartModel.findOne({ orderBy: userId });
            let finalAmount = 0;
            if (couponApplied && userCart.totalAfterDiscount) {
                finalAmount = userCart.totalAfterDiscount;
            } else {
                finalAmount = userCart.cartTotal;
            }

            let newOrder = new OrderModel({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: 'COD',
                    amount: finalAmount,
                    status: 'Cash On Delivery',
                    created: Date.now(),
                    currency: 'USD'
                },
                orderBy: userId,
                orderStatus: 'Cash On Delivery'
            });

            await newOrder.save();

            let update = userCart.products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: { $inc: { quantity: -item.count, sold: +item.count } }
                    }
                };
            });

            await ProductModel.bulkWrite(update, {});

            res.json({
                success: true,
                message: 'Order created successfully'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch data',
                errMessage: err.message
            });
        }
    };


    static getOrder = async (req, res) => {
        try {
            const { userId } = req.user;
            const userOrders = await OrderModel.find({ orderBy: userId }).populate('products.product').exec();
            res.json(userOrders);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unable to fetch data",
                errMessage: err.message
            });
        }
    }

    static updateOrderStatus = async (req, res) => {
        try {
            const { status } = req.body;
            const { id } = req.params;
            const updateOrderStatus = await OrderModel.findByIdAndUpdate(id, {
                orderStatus: status,
                paymentIntent: {
                    status: status
                }
            }, {
                new: true
            });

            res.json(updateOrderStatus);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to unable to fetch data",
                errMessage: err.message
            });
        }
    }
}

module.exports = UserController;