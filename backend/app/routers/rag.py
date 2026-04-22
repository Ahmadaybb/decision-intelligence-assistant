# backend/app/routers/rag.py
from fastapi import APIRouter
from backend.app.models.schemas import QueryRequest
from backend.app.utils.retrieval import retrieve_similar_tickets
from backend.app.utils.llm import generate_rag_answer, generate_no_rag_answer

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/ask")
def ask(request: QueryRequest):
    # Retrieve similar tickets
    results = retrieve_similar_tickets(request.query, top_k=3)
    
    # Build context
    context = "\n\n".join([
        f"Past conversation {i+1}:\n{doc}" 
        for i, doc in enumerate(results['documents'][0])
    ])
    
    # Generate answers
    rag_result = generate_rag_answer(request.query, context)
    no_rag_result = generate_no_rag_answer(request.query)
    
    # Build retrieved tickets list
    retrieved_tickets = [
        {
            "text": doc,
            "distance": round(dist, 4)
        }
        for doc, dist in zip(results['documents'][0], results['distances'][0])
    ]
    
    return {
        "rag_answer": {
            "answer": rag_result['answer'],
            "retrieved_tickets": retrieved_tickets,
            "latency": rag_result['latency']
        },
        "no_rag_answer": {
            "answer": no_rag_result['answer'],
            "latency": no_rag_result['latency']
        }
    }