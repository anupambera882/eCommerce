const { generateToken, verifyToken } = require('../config/jwt.config');
const UserService = require('../service/user.service');
const { transporter } = require('../config/email.config');
const refreshTokenMaxSize = 5;
const oneDay = 1000 * 60 * 60 * 24;

class UserController {
    static createUser = async (req, res) => {
        try {
            const { firstName, lastName, email, mobile, password } = req.body;

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
            const newUserSave = await UserService.createNewUser(newUser);
            const refreshToken = await generateToken({ id: newUserSave._id }, process.env.REFRESH_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_EXPIRATION_TIME);
            await UserService.updateUserDetailsById(newUserSave._id, { $push: { refreshToken: refreshToken } });
            await transporter.sendMail({
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
            return res.status(201).json({
                success: true,
                successMessage: "User register successfully",
                data: {
                    id: newUserSave._id,
                    firstName: newUserSave.firstName,
                    lastName: newUserSave.lastName,
                    email: newUserSave.email,
                    mobile: newUserSave.mobile,
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to Register",
                errMessage: err.message
            });
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
            const refreshToken = await generateToken({ UserId: userData._id }, process.env.REFRESH_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_EXPIRATION_TIME);
            await UserService.updateUserDetailsById(userData.id, { $push: { refreshToken: refreshToken } });
            // Create a access token 
            const accessToken = await generateToken(
                { userId: userData.id, email: userData.email, mobile: userData.mobile, role: userData.role },
                process.env.ACCESS_TOKEN_SECRET_KEY, process.env.ACCESS_TOKEN_EXPIRATION_TIME);
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

            await UserService.updateUserDetailsById(userData.id, { $pull: { refreshToken: refreshToken } });
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

            await UserService.updateUserDetailsById(userData.id, { $set: { refreshToken: [] } });
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

            await UserService.updateUserDetailsById(userData.id, { $set: { password: newPassword } })
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
            // console.log(link);
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
        const { password } = req.body
        const { id, token } = req.params
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
            // console.log(link);
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userData.email,
                subject: "mycommerce - Reactive Account Link",
                html: `<a href=${link}>Click Here</a> to Reactive Your Account Within 72 hours`
            });

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

            if (!userData || !(await userData.isPasswordMatch(password)) || userData.email !== email || userData.isDeleted !== true) {
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

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static unblockAUser = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static getWishList = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static loginAdmin = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to login your Account",
                errMessage: err.message
            });
        }
    }

    static saveAddress = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static userCart = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static getUserCart = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static emptyCart = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static applyCoupon = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static createOrder = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static getOrder = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }

    static updateOrderStatus = async (req, res) => {
        try {

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to reactive your Account",
                errMessage: err.message
            });
        }
    }
}

module.exports = UserController;