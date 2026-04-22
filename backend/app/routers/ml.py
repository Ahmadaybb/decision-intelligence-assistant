# backend/app/routers/ml.py
from fastapi import APIRouter
from backend.app.models.schemas import QueryRequest
from backend.app.utils.ml import predict_priority_ml
from backend.app.utils.llm import predict_priority_llm

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/priority")
def predict_priority(request: QueryRequest):
    # ML prediction
    ml_result = predict_priority_ml(request.query)
    
    # LLM prediction
    llm_result = predict_priority_llm(request.query)
    
    return {
        "ml_prediction": {
            "prediction": ml_result['prediction'],
            "confidence": ml_result['confidence'],
            "latency": ml_result['latency'],
            "cost": 0.0
        },
        "llm_prediction": {
            "prediction": llm_result['prediction'],
            "latency": llm_result['latency'],
            "cost": 0.0001
        }
    }