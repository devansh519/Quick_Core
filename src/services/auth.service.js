const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

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
        throw new Error("User already exists");
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

async function loginUser(credentials) {}

async function logoutUser(userId) {}

async function refreshAccessToken(refreshToken) {}

async function getCurrentUser(userId) {}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
};