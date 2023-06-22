const express = require("express");
const authRouter = express.Router();
const UserController = require('../controller/user.controller');
const { authMiddleware, authorizeRole } = require("../middleware/auth.middleware");
const { role } = require("../models/user.model");

// Public Routes
authRouter.post('/register', UserController.createUser); // 1
authRouter.post('/login', UserController.loginUser); //2
authRouter.get('/refresh-token', UserController.handleRefreshToken); // 4
authRouter.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail);
authRouter.post('/reset-password/:id/:token', UserController.userPasswordReset);
authRouter.post('/reactive-Deleted-account/:token', UserController.reactiveDeleteUser);

// Protected Routes
authRouter.get('/all-user', [authMiddleware, authorizeRole([role.ADMIN])], UserController.getAllUser); //3
authRouter.get('/logout', [authMiddleware], UserController.logoutUser);  // 5
authRouter.get('/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.getAUser); // 6
authRouter.post('/delete-account', [authMiddleware], UserController.deleteUserAccount); // 7
authRouter.post('/edit-user', [authMiddleware], UserController.updateUserDetailsById);  // 8
authRouter.post('/block-user/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.blockAUser); // 9
authRouter.post('/unblock-user/:id', [authMiddleware, authorizeRole([role.ADMIN])], UserController.unblockAUser); // 10
authRouter.post('/change-password', [authMiddleware], UserController.changeUserPassword);
authRouter.get('/logout-all-account', [authMiddleware], UserController.logoutAllUser);

module.exports = authRouter;