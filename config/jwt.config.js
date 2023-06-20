const jwt = require('jsonwebtoken');

const generateToken = async (data, SecretKey, time) => {
    const token = jwt.sign(data, SecretKey, { expiresIn: time });
    return token;
}

const verifyToken = async (token,SecretKey) => {
    const authData = jwt.verify(token, SecretKey);
    return authData;
}
module.exports = { generateToken, verifyToken };