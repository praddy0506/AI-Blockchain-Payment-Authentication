const express = require("express");
const router = express.Router();

const { createPayment } = require("../controllers/paymentController");
const verifyToken = require("../middleware/authMiddleware");

// Create Payment (Protected Route)
router.post("/", verifyToken, createPayment);

module.exports = router;