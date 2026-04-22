from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    query: str

class RetrievedTicket(BaseModel):
    text: str
    distance: float

class RAGResponse(BaseModel):
    answer: str
    retrieved_tickets: List[RetrievedTicket]
    latency: float

class MLPrediction(BaseModel):
    prediction: str
    confidence: float
    latency: float

class LLMPrediction(BaseModel):
    prediction: str
    latency: float

class FullResponse(BaseModel):
    rag_answer: RAGResponse
    no_rag_answer: str
    ml_prediction: MLPrediction
    llm_prediction: LLMPrediction