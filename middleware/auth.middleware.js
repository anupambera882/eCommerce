const { verify } = require("jsonwebtoken");

//  Authentication middleware
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(" ")[1];
        try {
            const user = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    errMessage: "Invalid Bearer Token"
                });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                errMessage: 'Access token expired, please refresh again'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            Message: 'There is no token attached in header'
        });
    }
}

// Authorization middleware
// Check is Admin or not , its work after authMiddleware
function authorizeRole(roles) {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You can\'t access this route'
            });
        }
        next();
    };
}

module.exports = { authMiddleware, authorizeRole };