const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // ================= USER DETAILS =================

        senderName: {
            type: String,
            required: true
        },

        receiverName: {
            type: String,
            required: true
        },

        // ================= PAYMENT DETAILS =================

        amount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        transactionType: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        device: {
            type: String,
            required: true
        },

        // ================= BALANCE DETAILS =================

        senderBalanceBefore: {
            type: Number,
            required: true
        },

        senderBalanceAfter: {
            type: Number,
            required: true
        },

        receiverBalanceBefore: {
            type: Number,
            required: true
        },

        receiverBalanceAfter: {
            type: Number,
            required: true
        },

        // ================= AI FRAUD DETAILS =================

        fraudScore: {
            type: Number,
            default: 0
        },

        prediction: {
            type: String,
            default: "Pending"
        },

        explanation: {
            type: String,
            default: ""
        },

        // ================= BLOCKCHAIN =================

        blockchainHash: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);