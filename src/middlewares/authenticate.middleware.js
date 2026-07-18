const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {

    // 1. Read access token from cookies
    const token = req.cookies.accessToken;

    // 2. Token missing
    if (!token) {
        throw new ApiError(
            401,
            "Access token is required"
        );
    }

    // 3. Verify JWT
    let decoded;

    try {

        decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid or expired access token"
        );

    }

    // 4. Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {

        throw new ApiError(
            401,
            "User no longer exists"
        );

    }

    // 5. Attach user to request
    req.user = user;

    next();

});

module.exports = authenticate;