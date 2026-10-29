# AI-Blockchain-Payment-Authentication

An AI-powered secure payment authentication system that detects fraudulent transactions using **XGBoost and SHAP explainability**, while recording genuine transactions securely on the **Hyperledger Fabric blockchain**.

## 📌 Project Overview

Traditional payment systems face challenges in identifying fraudulent transactions while maintaining transaction integrity and transparency.

This project combines Artificial Intelligence (AI), explainable machine learning, backend APIs, and blockchain technology to provide a secure payment authentication workflow.

The AI model evaluates payment transactions for potential fraud. Suspicious transactions can be blocked before blockchain submission, while genuine transactions proceed through the Hyperledger Fabric transaction workflow.

## ✨ Key Features

- **AI-Based Fraud Detection:** Uses an XGBoost model to identify potentially fraudulent payment transactions.
- **Explainable AI (XAI):** Uses SHAP to help explain the factors influencing fraud predictions.
- **Blockchain-Based Transaction Records:** Uses Hyperledger Fabric to securely record genuine transactions.
- **Secure Authentication:** Provides user authentication through backend APIs.
- **Payment Processing:** Handles payment requests and transaction validation.
- **Database Integration:** Uses MongoDB for application data storage.
- **Interactive Web Interface:** Provides a React-based interface for submitting payments and viewing results.
- **Containerized Services:** Uses Docker Compose to support service orchestration.

## 🏗️ System Architecture

```text
                 ┌──────────────────────┐
                 │     React Frontend   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Node.js / Express   │
                 │     Backend API      │
                 └───────┬────────┬─────┘
                         │        │
                         ▼        ▼
                ┌────────────┐  ┌────────────┐
                │ AI Fraud   │  │  MongoDB   │
                │ Detection  │  │  Database  │
                │ XGBoost    │  └────────────┘
                │ + SHAP     │
                └─────┬──────┘
                      │
                Fraud assessment
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
    ┌───────────────┐    ┌─────────────────┐
    │ Fraudulent    │    │ Genuine Payment │
    │ Payment       │    │                 │
    │ Blocked       │    └────────┬────────┘
    └───────────────┘             │
                                  ▼
                        ┌──────────────────┐
                        │ Hyperledger      │
                        │ Fabric Blockchain│
                        └──────────────────┘
```

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Artificial Intelligence | Python, XGBoost |
| Explainable AI | SHAP |
| Blockchain | Hyperledger Fabric |
| Smart Contracts | JavaScript chaincode |
| Database | MongoDB |
| Containerization | Docker, Docker Compose |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
AI-Blockchain-Payment-Authentication/
│
├── ai-model/
│   ├── app.py
│   ├── predict.py
│   ├── train.py
│   └── model/
│       └── fraud_model.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── blockchain/
│   └── chaincode/
│       └── payment/
│           ├── index.js
│           ├── paymentContract.js
│           └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── install-fabric.sh
└── README.md
```

## ⚙️ Prerequisites

Install the following tools before running the application:

- Git
- Node.js and npm
- Python 3
- MongoDB
- Docker and Docker Compose
- Hyperledger Fabric development environment

The required versions depend on the project's package files and Fabric configuration.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/praddy0506/AI-Blockchain-Payment-Authentication.git
cd AI-Blockchain-Payment-Authentication
```

### 2. Configure environment variables

Review the backend and AI model configuration files to identify the required environment variables.

Create local environment files as needed and configure your database connection, service URLs, and Hyperledger Fabric settings.

**Security:** Never commit `.env` files, credentials, private keys, or other secrets to GitHub.

### 3. Install backend dependencies

```bash
cd backend
npm install
```

Start the backend using the script configured in `backend/package.json`.

### 4. Install frontend dependencies

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

### 5. Set up the AI service

Install the Python dependencies required by the AI application. Use a virtual environment and the dependency list defined by the project, if available.

Run the AI service using the entry point and configuration provided in `ai-model/app.py`.

### 6. Configure Hyperledger Fabric

Review `install-fabric.sh`, `docker-compose.yml`, and the chaincode configuration before starting the blockchain environment.

Start the required Fabric network, configure the appropriate channel, and deploy the payment chaincode according to the project's network configuration.

> **Note:** Exact startup commands, dependency versions, environment variables, and network configuration should be verified against the project's source files before deployment.

## 🔄 Payment Authentication Workflow

1. The user submits a payment request through the frontend.
2. The backend validates the request and invokes the AI fraud-detection service.
3. The XGBoost model evaluates the transaction.
4. SHAP helps explain the model's prediction.
5. Transactions classified as fraudulent can be blocked before blockchain submission.
6. Genuine transactions proceed through the Hyperledger Fabric transaction workflow.
7. The application returns the transaction result to the frontend.

## 🔐 Security Considerations

- Keep credentials and environment variables private.
- Validate incoming payment requests on the backend.
- Protect authentication routes and sensitive endpoints.
- Verify blockchain identities, endorsement policies, and transaction results.
- Treat AI predictions as risk assessments and evaluate the model against appropriate test data.
- Use secure configuration and monitoring before any production deployment.

## 🎯 Project Objectives

- Detect potentially fraudulent payment transactions using machine learning.
- Improve the interpretability of AI-based fraud predictions.
- Protect transaction integrity using permissioned blockchain technology.
- Integrate AI, backend services, and blockchain into a unified application.
- Demonstrate a practical application of AI-powered payment security.

## 🔮 Future Enhancements

- Add real-time transaction monitoring and alerts.
- Improve fraud detection using additional validated transaction data.
- Introduce role-based access control and stronger authentication.
- Add transaction analytics and fraud statistics dashboards.
- Develop automated testing and continuous integration.
- Deploy the application to a secure cloud environment.

## 👨‍💻 Author

**Pradeep Kumar M**

GitHub: [@praddy0506](https://github.com/praddy0506)

## 📄 License

A license has not yet been specified. Add an appropriate license before distributing or reusing this project.
## 📸 Project Screenshots

### Screenshot 1
![Project Screenshot 1](Screenshot%202026-08-30%20104423.png)

### Screenshot 2
![Project Screenshot 2](Screenshot%202026-08-30%20110527.png)

### Screenshot 3
![Project Screenshot 3](Screenshot%202026-08-30%20110837.png)

### Screenshot 4
![Project Screenshot 4](Screenshot%202026-08-30%20111150.png)

