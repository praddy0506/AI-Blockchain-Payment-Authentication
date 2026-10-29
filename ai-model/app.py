from flask import Flask, request, jsonify
import pandas as pd
import xgboost as xgb
import shap

app = Flask(__name__)

# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model = xgb.XGBClassifier()
model.load_model("model/fraud_model.json")

print("✅ XGBoost model loaded")

# SHAP explainer
explainer = shap.TreeExplainer(model)

# Feature order used during training
FEATURES = [
    "step",
    "type",
    "amount",
    "oldbalanceOrg",
    "newbalanceOrig",
    "oldbalanceDest",
    "newbalanceDest",
    "isFlaggedFraud"
]

# Transaction type mapping
TYPE_MAPPING = {
    "PAYMENT": 0,
    "TRANSFER": 1,
    "CASH_OUT": 2,
    "DEBIT": 3,
    "CASH_IN": 4
}


# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "AI Fraud Detection Service is Running"
    })


# ==========================================
# FRAUD PREDICTION
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        # ------------------------------------------
        # Convert transaction type
        # ------------------------------------------

        transaction_type = data["type"]

        if transaction_type not in TYPE_MAPPING:

            return jsonify({
                "message": "Invalid transaction type"
            }), 400

        transaction_type = TYPE_MAPPING[transaction_type]


        # ------------------------------------------
        # Create feature data
        # ------------------------------------------

        transaction = {

            "step": data["step"],

            "type": transaction_type,

            "amount": data["amount"],

            "oldbalanceOrg": data["oldbalanceOrg"],

            "newbalanceOrig": data["newbalanceOrig"],

            "oldbalanceDest": data["oldbalanceDest"],

            "newbalanceDest": data["newbalanceDest"],

            "isFlaggedFraud": data["isFlaggedFraud"]

        }


        X = pd.DataFrame(
            [transaction],
            columns=FEATURES
        )


        # ------------------------------------------
        # XGBoost Prediction
        # ------------------------------------------

        probability = model.predict_proba(X)[0][1]

        prediction = "FRAUD" if probability >= 0.5 else "GENUINE"


        # ------------------------------------------
        # SHAP Explanation
        # ------------------------------------------

        shap_values = explainer.shap_values(X)

        explanation = {}

        for feature, value in zip(
            FEATURES,
            shap_values[0]
        ):

            explanation[feature] = round(
                float(value),
                4
            )


        # ------------------------------------------
        # Response
        # ------------------------------------------

        return jsonify({

            "fraudProbability": round(
                float(probability),
                4
            ),

            "fraudPercentage": round(
                float(probability * 100),
                2
            ),

            "prediction": prediction,

            "shapExplanation": explanation

        })


    except Exception as error:

        print("Prediction Error:", error)

        return jsonify({

            "message": "Prediction failed",

            "error": str(error)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=8000,
        debug=False
    )