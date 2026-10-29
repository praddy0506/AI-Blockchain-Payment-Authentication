import pandas as pd
import xgboost as xgb

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.metrics import roc_auc_score, average_precision_score


# ==========================================
# 1. LOAD DATASET
# ==========================================

file_path = "dataset/PS_20174392719_1491204439457_log.csv"

df = pd.read_csv(file_path)

print("=" * 60)
print("PAYMENT FRAUD DETECTION - XGBOOST")
print("=" * 60)

print("Total transactions:", len(df))


# ==========================================
# 2. SELECT FEATURES
# ==========================================

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

target = "isFraud"


# ==========================================
# 3. CONVERT TYPE INTO NUMBERS
# ==========================================

df["type"] = df["type"].map({
    "PAYMENT": 0,
    "TRANSFER": 1,
    "CASH_OUT": 2,
    "DEBIT": 3,
    "CASH_IN": 4
})


# ==========================================
# 4. CREATE X AND Y
# ==========================================

X = df[features]
y = df[target]

print("\nFeatures:")
print(X.columns.tolist())

print("\nTarget distribution:")
print(y.value_counts())


# ==========================================
# 5. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining transactions:", len(X_train))
print("Testing transactions:", len(X_test))


# ==========================================
# 6. HANDLE CLASS IMBALANCE
# ==========================================

fraud_count = y_train.sum()
genuine_count = len(y_train) - fraud_count

scale_pos_weight = genuine_count / fraud_count

print("\nScale Pos Weight:", scale_pos_weight)


# ==========================================
# 7. CREATE XGBOOST MODEL
# ==========================================

model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=scale_pos_weight,
    objective="binary:logistic",
    eval_metric="aucpr",
    random_state=42,
    n_jobs=-1
)


# ==========================================
# 8. TRAIN MODEL
# ==========================================

print("\nTraining XGBoost model...")

model.fit(
    X_train,
    y_train
)

print("Training completed!")


# ==========================================
# 9. PREDICTION
# ==========================================

y_probability = model.predict_proba(X_test)[:, 1]

y_prediction = (y_probability >= 0.5).astype(int)


# ==========================================
# 10. EVALUATION
# ==========================================

print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_prediction,
        target_names=["Genuine", "Fraud"]
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_prediction
    )
)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)

pr_auc = average_precision_score(
    y_test,
    y_probability
)

print("\nROC-AUC:", roc_auc)

print("PR-AUC:", pr_auc)


# ==========================================
# 11. SAVE MODEL
# ==========================================

model_path = "model/fraud_model.json"

model.save_model(model_path)

print("\nModel saved to:")
print(model_path)

print("\n" + "=" * 60)
print("DONE")
print("=" * 60)