from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="InfraWatch AI ML Service", version="2.0.0")
BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "model" / "risk_model.pkl"
bundle = None

class ProjectData(BaseModel):
    physicalProgress: float
    financialProgress: float
    plannedProgress: float
    actualProgress: float
    approvedCost: float
    revisedCost: float
    expenditure: float

@app.on_event("startup")
def load_model():
    global bundle
    if MODEL_PATH.exists():
        bundle = joblib.load(MODEL_PATH)
        print("Random Forest risk model loaded successfully.")
    else:
        print("WARNING: model not found. Run: python train_model.py")

@app.get("/")
def home():
    return {"message":"InfraWatch AI ML Service is running","modelLoaded":bundle is not None}

@app.get("/health")
def health():
    return {"success":True,"modelLoaded":bundle is not None}

@app.post("/predict-risk")
def predict_risk(data: ProjectData):
    if bundle is None:
        raise HTTPException(503, "ML model is not loaded. Run python train_model.py first.")

    gap = data.plannedProgress - data.actualProgress
    escalation = ((data.revisedCost-data.approvedCost)/data.approvedCost*100) if data.approvedCost else 0

    values = pd.DataFrame([{
        "physicalProgress":data.physicalProgress,
        "financialProgress":data.financialProgress,
        "plannedProgress":data.plannedProgress,
        "actualProgress":data.actualProgress,
        "approvedCost":data.approvedCost,
        "revisedCost":data.revisedCost,
        "expenditure":data.expenditure,
        "progressGap":gap,
        "costEscalation":escalation
    }])[bundle["features"]]

    model=bundle["model"]
    level=model.predict(values)[0]
    confidence=max(model.predict_proba(values)[0])*100
    score={"Low":15,"Medium":35,"High":65,"Critical":90}.get(level,0)

    return {"success":True,"prediction":{
        "riskScore":score,"riskLevel":level,
        "confidence":round(confidence,2),
        "progressGap":round(gap,2),
        "costEscalation":round(escalation,2)
    }}
