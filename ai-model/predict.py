import pandas as pd
import xgboost as xgb
import shap


# ==========================================
# 1. LOAD TRAINED MODEL
# ==========================================

model = xgb.XGBClassifier()

model.load_model("model/fraud_model.json")

print("✅ XGBoost model loaded")


# ==========================================
# 2. CREATE SAMPLE TRANSACTION
# ==========================================

transaction = {
    "step": 100,
    "type": "TRANSFER",
    "amount": 5000,
    "oldbalanceOrg": 10000,
    "newbalanceOrig": 5000,
    "oldbalanceDest": 2000,
    "newbalanceDest": 7000,
    "isFlaggedFraud": 0
}


# ==========================================
# 3. CONVERT TRANSACTION TO DATAFRAME
# ==========================================

transaction["type"] = {
    "PAYMENT": 0,
    "TRANSFER": 1,
    "CASH_OUT": 2,
    "DEBIT": 3,
    "CASH_IN": 4
}[transaction["type"]]


features = [
    "step",
    "type",
    "amount",
    "oldbalanceOrg",
    "newbalanceOrig",
    "oldbalanceDest",
    "newbalanceDest",
    "isFlaggedFraud"
]

X = pd.DataFrame(
    [transaction],
    columns=features
)


# ==========================================
# 4. MAKE PREDICTION
# ==========================================

probability = model.predict_proba(X)[0][1]

prediction = 1 if probability >= 0.5 else 0


print("\n" + "=" * 50)
print("FRAUD PREDICTION")
print("=" * 50)

print("Fraud Probability:", probability)
print("Fraud Percentage:", round(probability * 100, 2), "%")

if prediction == 1:
    print("Prediction: FRAUD")
else:
    print("Prediction: GENUINE")


# ==========================================
# 5. SHAP EXPLANATION
# ==========================================

print("\n" + "=" * 50)
print("SHAP EXPLANATION")
print("=" * 50)

explainer = shap.TreeExplainer(model)

shap_values = explainer.shap_values(X)

for feature, value in zip(features, shap_values[0]):

    print(
        feature,
        "→",
        round(value, 4)
    )