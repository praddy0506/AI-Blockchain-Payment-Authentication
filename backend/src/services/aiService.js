const axios = require("axios");

// ==========================================
// PYTHON AI SERVICE URL
// ==========================================

const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";


// ==========================================
// SEND PAYMENT TO AI MODEL
// ==========================================

const predictFraud = async (paymentData) => {

    try {

        const response = await axios.post(
            AI_SERVICE_URL,
            paymentData
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI Service Error:",
            error.message
        );

        throw new Error(
            "AI Fraud Detection Service unavailable"
        );

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    predictFraud
};