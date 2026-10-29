const paymentRoutes = require("./routes/paymentRoutes");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "AI Blockchain Payment Authentication API is Running"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = app;