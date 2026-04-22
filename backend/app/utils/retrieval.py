# backend/app/utils/retrieval.py
import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb

# Load embedding model
print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Setup ChromaDB with persistence
chroma_client = chromadb.PersistentClient(path="data/chroma_db")
collection = chroma_client.get_or_create_collection(name="support_tickets")

def build_collection():
    if collection.count() > 0:
        print(f"Collection already loaded with {collection.count()} tickets. Skipping rebuild.")
        return
    
    print("Loading Amazon conversations...")
    df = pd.read_csv('data/amazon_conversations.csv')
    documents = df['conversation'].tolist()
    ids = [str(i) for i in range(len(documents))]
    
    print("Generating embeddings...")
    embeddings = embedding_model.encode(documents, show_progress_bar=True)
    
    batch_size = 5000
    for i in range(0, len(documents), batch_size):
        collection.add(
            documents=documents[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size].tolist(),
            ids=ids[i:i+batch_size]
        )
    print(f"Collection built with {collection.count()} tickets.")

def retrieve_similar_tickets(query: str, top_k: int = 3):
    query_embedding = embedding_model.encode(query).tolist()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results

build_collection()