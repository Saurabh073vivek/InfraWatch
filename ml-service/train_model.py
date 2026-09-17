from pathlib import Path
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

BASE = Path(__file__).resolve().parent
df = pd.read_csv(BASE / "data" / "training_data.csv")

features = [
    "physicalProgress","financialProgress","plannedProgress",
    "actualProgress","approvedCost","revisedCost","expenditure",
    "progressGap","costEscalation"
]

X_train, X_test, y_train, y_test = train_test_split(
    df[features], df["riskLevel"],
    test_size=0.20, random_state=42, stratify=df["riskLevel"]
)

model = RandomForestClassifier(
    n_estimators=200, max_depth=8,
    random_state=42, class_weight="balanced"
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print(f"Model accuracy: {accuracy_score(y_test, pred):.2%}")
print(classification_report(y_test, pred, zero_division=0))

joblib.dump({"model": model, "features": features}, BASE/"model"/"risk_model.pkl")
print("Model saved:", BASE/"model"/"risk_model.pkl")
