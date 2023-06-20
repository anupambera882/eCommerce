const express = require("express");
const authRouter = express.Router();
const UserController = require('../controller/user.controller');
const { authMiddleware, authorizeRole } = require("../middleware/auth.middleware");
// const { role } = require("../models/user.model");

// Public Routes
authRouter.post('/register', UserController.createUser);
authRouter.post('/login', UserController.loginUser);
authRouter.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail);
authRouter.post('/reset-password/:id/:token', UserController.userPasswordReset);
authRouter.post('/reactive-Deleted-account/:token', UserController.reactiveDeleteUser);
authRouter.get('/refresh-token', UserController.handleRefreshToken);

// Protected Routes
authRouter.post('/change-password', [authMiddleware], UserController.changeUserPassword);
authRouter.post('/update-account-details', [authMiddleware], UserController.updateUserDetailsById);
authRouter.post('/delete-account', [authMiddleware], UserController.deleteUserAccount);
authRouter.get('/logout',[authMiddleware], UserController.logoutUser);
authRouter.get('/logout-all-account',[authMiddleware], UserController.logoutAllUser);

module.exports = authRouter;