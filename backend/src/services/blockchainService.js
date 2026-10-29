const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const grpc = require("@grpc/grpc-js");

const {
    connect,
    signers,
    hash
} = require("@hyperledger/fabric-gateway");
// =====================================================
// FABRIC CONFIGURATION
// =====================================================

const CHANNEL_NAME = "paymentchannel";
const CHAINCODE_NAME = "payment";

const NETWORK_DIR = path.resolve(
    __dirname,
    "../../../fabric-samples/test-network"
);

// =====================================================
// CERTIFICATE
// =====================================================

const CERT_PATH = path.join(
    NETWORK_DIR,
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "users",
    "Admin@org1.example.com",
    "msp",
    "signcerts",
    "cert.pem"
);

// =====================================================
// PRIVATE KEY
// =====================================================

const KEY_DIR = path.join(
    NETWORK_DIR,
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "users",
    "Admin@org1.example.com",
    "msp",
    "keystore"
);

// =====================================================
// TLS CERTIFICATE
// =====================================================

const TLS_CERT_PATH = path.join(
    NETWORK_DIR,
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "peers",
    "peer0.org1.example.com",
    "tls",
    "ca.crt"
);

// =====================================================
// CREATE FABRIC CONNECTION
// =====================================================

function getContract() {

    // Read certificate
    const certificate = fs.readFileSync(
        CERT_PATH
    );

    // Find private key
    const keyFiles = fs.readdirSync(
        KEY_DIR
    );

    if (keyFiles.length === 0) {
        throw new Error(
            "Fabric private key not found"
        );
    }

    const privateKeyPath = path.join(
        KEY_DIR,
        keyFiles[0]
    );

    const privateKey = fs.readFileSync(
        privateKeyPath
    );

    // Read TLS certificate
    const tlsRootCert = fs.readFileSync(
        TLS_CERT_PATH
    );

    // =================================================
    // CONNECT TO ORG1 PEER
    // =================================================

    const client = new grpc.Client(
        "localhost:7051",
        grpc.credentials.createSsl(
            tlsRootCert
        ),
        {
            "grpc.ssl_target_name_override":
                "peer0.org1.example.com"
        }
    );

    // =================================================
    // X.509 IDENTITY
    // =================================================

    const userIdentity = {
        mspId: "Org1MSP",
        credentials: certificate
    };

    // =================================================
    // FABRIC GATEWAY
    // =================================================

    const gateway = connect({

        client,

        identity: userIdentity,

        signer: signers.newPrivateKeySigner(
            crypto.createPrivateKey(
                privateKey
            )
        ),

        hash: hash.sha256,

        evaluateOptions: () => ({
            deadline:
                Date.now() + 5000
        }),

        endorseOptions: () => ({
            deadline:
                Date.now() + 15000
        }),

        submitOptions: () => ({
            deadline:
                Date.now() + 15000
        }),

        commitStatusOptions: () => ({
            deadline:
                Date.now() + 60000
        })
    });

    // =================================================
    // GET NETWORK
    // =================================================

    const network =
        gateway.getNetwork(
            CHANNEL_NAME
        );

    // =================================================
    // GET CHAINCODE CONTRACT
    // =================================================

    const contract =
        network.getContract(
            CHAINCODE_NAME
        );

    return {
        gateway,
        contract
    };
}

// =====================================================
// RECORD PAYMENT ON BLOCKCHAIN
// =====================================================

async function recordPayment(payment) {

    let gateway;

    try {

        const connection = getContract();

        gateway = connection.gateway;

        const contract = connection.contract;

        console.log(
            "⛓️ Sending payment to Hyperledger Fabric..."
        );

        // =============================================
        // CREATE PROPOSAL
        // =============================================

        const proposal = contract.newProposal(
            "CreatePayment",
            {
                arguments: [
                    String(payment.transactionId),
                    String(payment.senderName),
                    String(payment.receiverName),
                    String(payment.amount),
                    String(payment.fraudScore),
                    String(payment.prediction),
                    String(payment.createdAt)
                ]
            }
        );

        // =============================================
        // REAL FABRIC TRANSACTION ID
        // =============================================

        const transactionId =
            proposal.getTransactionId();

        console.log(
            "⛓️ Fabric Transaction ID:",
            transactionId
        );

        // =============================================
        // ENDORSE
        // =============================================

        const transaction =
            await proposal.endorse();

        console.log(
            "⛓️ Transaction endorsed successfully"
        );

        // =============================================
        // SUBMIT TO ORDERER
        // =============================================

        const commit =
            await transaction.submit();

        console.log(
            "⛓️ Transaction submitted to orderer"
        );

        // =============================================
        // WAIT FOR COMMIT
        // =============================================

        const status =
            await commit.getStatus();

        if (!status.successful) {

            throw new Error(
                `Fabric transaction failed with status code ${status.code}`
            );

        }

        console.log(
            "⛓️ Transaction committed successfully"
        );

        // =============================================
        // GET CHAINCODE RESULT
        // =============================================

        const result =
            transaction.getResult();

        const blockchainResult =
            Buffer.from(result).toString();

        console.log(
            "⛓️ Blockchain result:",
            blockchainResult
        );

        return {

            transactionId,

            result:
                blockchainResult

        };

    } catch (error) {

        console.error(
            "❌ Blockchain Error:",
            error.message
        );

        throw error;

    } finally {

        if (gateway) {
            gateway.close();
        }
    }
}
// =====================================================
// EXPORT
// =====================================================

module.exports = {
    recordPayment
};