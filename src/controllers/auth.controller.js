const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const registerUser = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);

    res.cookie("accessToken", result.accessToken, cookieOptions);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: result.user },
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body);

    res.cookie("accessToken", result.accessToken, cookieOptions);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: result.user },
            "Login successful"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user.id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logout successful"
        )
    );
});

const refreshTokenAccess = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Access token refreshed successfully"
        )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        )
    );
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenAccess,
    getCurrentUser,
};