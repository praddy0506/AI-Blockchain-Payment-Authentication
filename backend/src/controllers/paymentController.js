const Payment = require("../models/Payment");

const {
    predictFraud
} = require("../services/aiService");

const {
    recordPayment
} = require("../services/blockchainService");


// =====================================================
// CREATE PAYMENT
// =====================================================

const createPayment = async (req, res) => {

    try {

        const {

            senderName,
            receiverName,
            amount,

            paymentMethod,
            transactionType,

            location,
            device,

            senderBalanceBefore,
            senderBalanceAfter,

            receiverBalanceBefore,
            receiverBalanceAfter

        } = req.body;


        // =====================================================
        // VALIDATION
        // =====================================================

        if (

            !senderName ||
            !receiverName ||
            !amount ||
            !paymentMethod ||
            !transactionType ||
            !location ||
            !device

        ) {

            return res.status(400).json({

                message:
                    "Please provide all payment details"

            });

        }


        if (

            senderBalanceBefore === undefined ||
            senderBalanceAfter === undefined ||
            receiverBalanceBefore === undefined ||
            receiverBalanceAfter === undefined

        ) {

            return res.status(400).json({

                message:
                    "Please provide all balance details"

            });

        }


        // =====================================================
        // PREPARE DATA FOR AI
        // =====================================================

        const aiData = {

            step: 100,

            type:
                transactionType,

            amount:
                amount,

            oldbalanceOrg:
                senderBalanceBefore,

            newbalanceOrig:
                senderBalanceAfter,

            oldbalanceDest:
                receiverBalanceBefore,

            newbalanceDest:
                receiverBalanceAfter,

            isFlaggedFraud:
                0

        };


        // =====================================================
        // SEND PAYMENT TO AI
        // =====================================================

        console.log(
            "🤖 Sending payment to AI..."
        );

        const aiResult =
            await predictFraud(
                aiData
            );

        console.log(
            "🤖 AI Result:",
            aiResult
        );


        // =====================================================
        // CREATE PAYMENT IN MONGODB
        // =====================================================

        const payment =
            new Payment({

                senderName,

                receiverName,

                amount,

                paymentMethod,

                transactionType,

                location,

                device,

                senderBalanceBefore,

                senderBalanceAfter,

                receiverBalanceBefore,

                receiverBalanceAfter,

                fraudScore:
                    aiResult.fraudPercentage,

                prediction:
                    aiResult.prediction,

                explanation:
                    JSON.stringify(
                        aiResult.shapExplanation
                    )

            });


        // =====================================================
        // SAVE PAYMENT TO MONGODB
        // =====================================================

        await payment.save();


        // =====================================================
        // BLOCKCHAIN
        // =====================================================

        let blockchainResult = null;


        // Only genuine payments go to blockchain
        if (
            aiResult.prediction === "GENUINE"
        ) {

            console.log(
                "⛓️ Genuine payment detected."
            );

            console.log(
                "⛓️ Sending payment to blockchain..."
            );


            blockchainResult =
                await recordPayment({

                    // MongoDB payment ID
                    transactionId:
                        payment._id.toString(),

                    senderName:
                        payment.senderName,

                    receiverName:
                        payment.receiverName,

                    amount:
                        payment.amount,

                    fraudScore:
                        payment.fraudScore,

                    prediction:
                        payment.prediction,

                    createdAt:
                        payment.createdAt

                });


            // =================================================
            // SAVE REAL FABRIC TRANSACTION ID
            // =================================================

            payment.blockchainHash =
                blockchainResult.transactionId;


            await payment.save();


            console.log(
                "⛓️ Blockchain Transaction ID:",
                payment.blockchainHash
            );

        }

        else {

            console.log(
                "🚨 Fraud detected."
            );

            console.log(
                "🚨 Payment NOT sent to blockchain."
            );

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(201).json({

            message:
                "Payment Created Successfully",

            payment,

            aiResult,

            blockchain:
                blockchainResult

        });

    }


    // =====================================================
    // ERROR HANDLING
    // =====================================================

    catch (error) {

        console.error(
            "Payment Error:",
            error
        );

        return res.status(500).json({

            message:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createPayment
};