# Decision Intelligence Assistant

A customer support intelligence platform that demonstrates three AI decision-making approaches side-by-side: **Retrieval-Augmented Generation (RAG)**, **traditional ML classification**, and **LLM zero-shot inference**. Built to show the engineering trade-offs between cost, latency, and accuracy.

---

## What it does

Given any customer support query, the assistant simultaneously:

1. **Predicts ticket priority** using a trained Logistic Regression model (~2ms, $0/call) and LLaMA 3 via Groq (~1700ms, ~$0.0001/call)
2. **Generates a support answer** with RAG (retrieves the 3 most similar past conversations from ChromaDB, then synthesizes a context-aware response) and without RAG (pure LLM generation)
3. **Shows real-time metrics** — latency, confidence, cost, and retrieved sources — so you can see exactly why each approach behaves the way it does

---

## Architecture

```
┌─────────────────────────────────────┐
│         Browser (port 3000)         │
│   React 19 + Vite + React Router    │
└──────────────┬──────────────────────┘
               │ HTTP (Axios)
               ▼
┌─────────────────────────────────────┐
│      FastAPI Backend (port 8000)    │
│                                     │
│  POST /predict/priority             │
│    ├─ ML:  Logistic Regression      │
│    │       (joblib, ~2ms)           │
│    └─ LLM: LLaMA 3 via Groq        │
│            (~1700ms)                │
│                                     │
│  POST /rag/ask                      │
│    ├─ Retrieval: ChromaDB           │
│    │  (all-MiniLM-L6-v2 embeddings) │
│    ├─ RAG answer (with context)     │
│    └─ No-RAG answer (pure LLM)     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
  ChromaDB          Groq API
  (local vector     (LLaMA 3
   store)            cloud)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router DOM, Axios |
| Backend | FastAPI, Uvicorn, Python 3.12 |
| ML Model | Scikit-learn Logistic Regression, joblib |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` |
| Vector DB | ChromaDB (local persistent store) |
| LLM | LLaMA 3 via Groq API |
| Containerization | Docker, Docker Compose, Nginx |
| Dependency Manager | uv |

---

## Dataset

- **8,381 Amazon customer support conversations** (`data/amazon_conversations.csv`)
- Pre-embedded and indexed in ChromaDB (`data/chroma_db/`)
- Pre-trained priority model saved as `data/priority_model.joblib`

---

## Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A [Groq API key](https://console.groq.com/) (free tier available)

### 1. Set your API key

Create a `.env` file in the project root:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Build and run

```bash
docker compose up --build
```

This starts:
- **Backend** at `http://localhost:8000`
- **Frontend** at `http://localhost:3000`

### 3. Open the app

Navigate to `http://localhost:3000` and try a query like:

> *"My order hasn't arrived in 2 weeks and I need it urgently"*

### Stopping

```bash
docker compose down
```

---

## Local Development (without Docker)

### Backend

Requires Python 3.12+ and [uv](https://docs.astral.sh/uv/).

```bash
# Install dependencies
uv sync

# Set environment variable
export GROQ_API_KEY=your_groq_api_key_here   # macOS/Linux
set GROQ_API_KEY=your_groq_api_key_here      # Windows

# Start the backend
uv run uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` (or `3000` depending on Vite config).

---

## API Reference

### `GET /`

Health check.

**Response:**
```json
{ "status": "ok" }
```

---

### `POST /predict/priority`

Predicts ticket priority using both an ML model and an LLM.

**Request:**
```json
{ "query": "My order hasn't arrived in 2 weeks" }
```

**Response:**
```json
{
  "ml_prediction": {
    "prediction": "High",
    "confidence": 0.87,
    "latency": 2.34,
    "cost": 0.0
  },
  "llm_prediction": {
    "prediction": "High",
    "latency": 1650.12,
    "cost": 0.0001
  }
}
```

Priority values: `High`, `Medium`, `Low`

---

### `POST /rag/ask`

Answers a query using both RAG (with retrieved context) and pure LLM generation.

**Request:**
```json
{ "query": "How do I return a damaged item?" }
```

**Response:**
```json
{
  "rag_answer": {
    "answer": "Based on similar cases, you can return...",
    "retrieved_tickets": [
      { "text": "Customer received damaged...", "distance": 0.12 }
    ],
    "latency": 1450.23
  },
  "no_rag_answer": {
    "answer": "I understand you received a damaged item...",
    "latency": 800.45
  }
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | Yes | — | Groq API key for LLM calls |
| `VITE_API_URL` | No | `http://localhost:8000` | Backend URL (used at frontend build time) |

To point the frontend at a different backend (e.g., a remote server), rebuild with:

```bash
docker compose build --build-arg VITE_API_URL=http://your-server:8000 frontend
```

---

## Project Structure

```
decision-intelligence-assistant/
├── Dockerfile                # Backend container
├── docker-compose.yml        # Multi-service orchestration
├── .dockerignore
├── pyproject.toml            # Python dependencies (uv)
├── backend/
│   └── app/
│       ├── main.py           # FastAPI app + CORS
│       ├── models/
│       │   └── schemas.py    # Request/response models
│       ├── routers/
│       │   ├── rag.py        # /rag/ask endpoint
│       │   └── ml.py         # /predict/priority endpoint
│       └── utils/
│           ├── llm.py        # Groq LLM calls
│           ├── retrieval.py  # ChromaDB queries
│           ├── ml.py         # ML model inference
│           └── features.py   # Feature extraction
├── frontend/
│   ├── Dockerfile            # Frontend container (Node build → Nginx)
│   ├── nginx.conf            # SPA routing config
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx           # Router setup
│       ├── pages/
│       │   ├── Home.jsx      # Landing page
│       │   ├── Assistant.jsx # Main demo interface
│       │   └── About.jsx     # Architecture info
│       └── components/
│           └── Navbar.jsx
└── data/
    ├── amazon_conversations.csv  # 8,381 training examples
    ├── priority_model.joblib     # Trained Logistic Regression
    ├── model_config.joblib       # Feature columns & keywords
    └── chroma_db/                # Persisted vector embeddings
```

---

## Key Engineering Trade-offs

| | ML Model | LLM Zero-shot | RAG + LLM |
|---|---|---|---|
| **Latency** | ~2ms | ~1700ms | ~1500ms |
| **Cost** | $0 | ~$0.0001/call | ~$0.0001/call |
| **Accuracy** | Good (trained) | Good (zero-shot) | Best (grounded) |
| **Explainability** | Confidence score | None | Retrieved sources |
| **Scales to 1M/day?** | Yes | Expensive | Expensive |

**Recommendation for production:** Use the ML model for real-time triage (latency + cost), fall back to LLM only for edge cases or when confidence is low.

---

## Known Limitations

- The ML model was trained on Amazon e-commerce conversations; accuracy drops for other domains
- ChromaDB runs in-memory with local persistence — not suitable for distributed deployments without migration to a managed vector store
- The frontend API URL is baked in at build time; changing it requires a rebuild
