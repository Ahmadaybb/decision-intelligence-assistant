import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def predict_priority_llm(text: str) -> dict:
    start_time = time.time()
    
    prompt = f"""You are analyzing a customer support ticket to determine its priority.

Customer message: {text}

Is this ticket URGENT or NORMAL?
Reply with ONLY one word: either "URGENT" or "NORMAL"."""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    latency = time.time() - start_time
    prediction = response.choices[0].message.content.strip().upper()
    label = 1 if "URGENT" in prediction else 0
    
    return {
        'prediction': 'URGENT' if label == 1 else 'NORMAL',
        'latency': round(latency * 1000, 2)
    }

def generate_rag_answer(query: str, context: str) -> dict:
    start_time = time.time()
    
    prompt = f"""You are an Amazon customer support assistant.
Use the following similar past conversations as context to help answer the user's query.

{context}

User query: {query}

Provide a helpful response based on how Amazon support handled similar cases:"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    latency = time.time() - start_time
    
    return {
        'answer': response.choices[0].message.content,
        'latency': round(latency * 1000, 2)
    }

def generate_no_rag_answer(query: str) -> dict:
    start_time = time.time()
    
    prompt = f"""You are an Amazon customer support assistant.

User query: {query}

Provide a helpful response:"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    latency = time.time() - start_time
    
    return {
        'answer': response.choices[0].message.content,
        'latency': round(latency * 1000, 2)
    }