const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            jti: crypto.randomUUID(),
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY || "30d",
        }
    );
};

module.exports = generateRefreshToken;