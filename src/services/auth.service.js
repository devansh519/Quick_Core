const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

const ApiError = require("../utils/ApiError");

const comparePassword = require("../utils/comparePassword");
const hashPassword = require("../utils/hashPassword");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

async function registerUser(userData) {
    const {
        name,
        email,
        phone,
        password,
        role = "customer",
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email or phone already exists"
        );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
}

async function loginUser(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isMatch = await comparePassword(
        password,
        user.password
    );

    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
}

async function logoutUser(userId) {
    await RefreshToken.deleteMany({
        user: userId,
    });

    return true;
}

async function refreshAccessToken(token) {

    if (!token) {
        throw new ApiError(
            401,
            "Refresh token is required"
        );
    }

    const storedToken = await RefreshToken.findOne({
        token,
        isRevoked: false,
    });

    if (!storedToken) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    let payload;

    try {
        payload = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw new ApiError(
            401,
            "Refresh token has expired or is invalid"
        );
    }

    const accessToken = generateAccessToken({
        _id: payload.id,
        role: payload.role,
    });

    return accessToken;
}

async function getCurrentUser(userId) {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
};