const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenAccess,
    getCurrentUser,
} = require("../controllers/auth.controller");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenAccess);
router.get("/me", getCurrentUser);

module.exports = router;