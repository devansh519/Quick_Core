const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenAccess,
    getCurrentUser,
} = require("../controllers/auth.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    registerSchema,
    loginSchema,
} = require("../validations/auth.validation");

// Public Routes
router.post(
    "/signup",
    validate(registerSchema),
    registerUser
);

router.post(
    "/login",
    validate(loginSchema),
    loginUser
);

router.post(
    "/refresh-token",
    refreshTokenAccess
);

// Protected Routes
router.post(
    "/logout",
    authenticate,
    logoutUser
);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

module.exports = router;