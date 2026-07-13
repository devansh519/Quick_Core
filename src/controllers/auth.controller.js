const authService = require("../services/auth.service");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

async function registerUser(req, res, next) {
    try {
        const result = await authService.registerUser(req.body);

        res.cookie("accessToken", result.accessToken, cookieOptions);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}

async function loginUser(req, res, next) {
    try {
        const result = await authService.loginUser(req.body);

        res.cookie("accessToken", result.accessToken, cookieOptions);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}

async function logoutUser(req, res, next) {
    try {
        await authService.logoutUser(req.user.id);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
}

async function refreshTokenAccess(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;

        const accessToken =
            await authService.refreshAccessToken(refreshToken);

        res.cookie("accessToken", accessToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
        });
    } catch (error) {
        next(error);
    }
}

async function getCurrentUser(req, res, next) {
    try {
        const user =
            await authService.getCurrentUser(req.user.id);

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenAccess,
    getCurrentUser,
};