'use strict';

const { Contract } = require('fabric-contract-api');

class PaymentContract extends Contract {

    // Create a new payment on the blockchain
    async CreatePayment(
        ctx,
        transactionId,
        sender,
        receiver,
        amount,
        fraudScore,
        prediction,
        timestamp
    ) {
        // Check whether payment already exists
        const exists = await this.PaymentExists(ctx, transactionId);

        if (exists) {
            throw new Error(
                `Payment ${transactionId} already exists`
            );
        }

        // Payment object stored on Fabric ledger
        const payment = {
            transactionId: transactionId,
            sender: sender,
            receiver: receiver,
            amount: Number(amount),
            fraudScore: Number(fraudScore),
            prediction: prediction,
            timestamp: timestamp,
            blockchainTimestamp: new Date().toISOString()
        };

        // Store payment on blockchain ledger
        await ctx.stub.putState(
            transactionId,
            Buffer.from(JSON.stringify(payment))
        );

        return JSON.stringify(payment);
    }

    // Get one payment
    async GetPayment(ctx, transactionId) {

        const paymentBytes = await ctx.stub.getState(transactionId);

        if (!paymentBytes || paymentBytes.length === 0) {
            throw new Error(
                `Payment ${transactionId} does not exist`
            );
        }

        return paymentBytes.toString();
    }

    // Check whether a payment exists
    async PaymentExists(ctx, transactionId) {

        const paymentBytes = await ctx.stub.getState(transactionId);

        return paymentBytes && paymentBytes.length > 0;
    }

    // Get all payments
    async GetAllPayments(ctx) {

        const iterator = await ctx.stub.getStateByRange('', '');

        const payments = [];

        let result = await iterator.next();

        while (!result.done) {

            const value = result.value.value.toString();

            try {
                payments.push(JSON.parse(value));
            } catch (error) {
                console.error(
                    'Invalid payment data:',
                    error
                );
            }

            result = await iterator.next();
        }

        await iterator.close();

        return JSON.stringify(payments);
    }
}

module.exports = PaymentContract;