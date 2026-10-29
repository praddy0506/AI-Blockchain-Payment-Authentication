const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getProfile
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Profile
router.get("/profile", verifyToken, getProfile);

module.exports = router;