from dotenv import load_dotenv
load_dotenv() 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import rag, ml
from dotenv import load_dotenv
app = FastAPI(title="Decision Intelligence Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag.router)
app.include_router(ml.router)

@app.get("/")
def health_check():
    return {"status": "ok"}