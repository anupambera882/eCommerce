const express = require("express");
const authRouter = express.Router();
const UserController = require('../controller/user.controller');
const { authMiddleware, authorizeRole } = require("../middleware/auth.middleware");
const { role } = require("../models/user.model");


// public Routes
authRouter.post('/register', UserController.createUser);
authRouter.post('/login', UserController.loginUser);
authRouter.get('/refresh-token', UserController.handleRefreshToken);
authRouter.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail);
authRouter.post('/reset-password/:id/:token', UserController.userPasswordReset);
authRouter.post('/reactive-Deleted-account/:token', UserController.reactiveDeleteUser);
authRouter.post('/admin-login', UserController.loginAdmin)

// protected Routes
authRouter.get('/all-user', [authMiddleware, authorizeRole([role.ADMIN])], UserController.getAllUser);
authRouter.get('/logout', [authMiddleware], UserController.logoutUser);
authRouter.get('/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.getAUser);
authRouter.post('/delete-account', [authMiddleware], UserController.deleteUserAccount);
authRouter.post('/edit-user', [authMiddleware], UserController.updateUserDetailsById);
authRouter.post('/block-user/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.blockAUser);
authRouter.post('/unblock-user/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.unblockAUser);
authRouter.post('/change-password', [authMiddleware], UserController.changeUserPassword);
authRouter.get('/logout-all-account', [authMiddleware], UserController.logoutAllUser);
authRouter.get('/get-WishList', [authMiddleware], UserController.getWishList);
authRouter.post('/user-cart', [authMiddleware], UserController.userCart);
authRouter.get('/get-user-cart', [authMiddleware], UserController.getUserCart);


module.exports = authRouter;