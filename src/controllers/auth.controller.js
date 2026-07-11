const authService = require("../services/auth.service");

async function registerUser(req, res, next) {
    try {
        const result = await authService.registerUser(req.body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.user,
        });

    } catch (error) {
        next(error);
    }
}

async function loginUser(req, res, next) {}

async function logoutUser(req, res, next) {}

async function refreshTokenAccess(req, res, next) {}

async function getCurrentUser(req, res, next) {}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenAccess,
    getCurrentUser,
};