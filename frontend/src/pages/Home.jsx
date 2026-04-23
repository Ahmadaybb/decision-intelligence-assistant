import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  { title: 'RAG Answer', emoji: '🔍', accent: '#6c63ff', desc: 'Answers grounded in real past support tickets via vector retrieval.' },
  { title: 'No-RAG Answer', emoji: '🤖', accent: '#ff6584', desc: 'LLM answers from general knowledge — no retrieval context.' },
  { title: 'ML Prediction', emoji: '⚡', accent: '#10b981', desc: 'Logistic Regression priority prediction in ~2ms, zero API cost.' },
  { title: 'LLM Zero-shot', emoji: '🧠', accent: '#f59e0b', desc: 'LLM predicts ticket priority without task-specific training.' },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a1a', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '7rem 2rem 4rem' }}>
        <div style={{
          display: 'inline-block',
          padding: '0.3rem 1rem',
          borderRadius: '999px',
          backgroundColor: 'rgba(108,99,255,0.12)',
          border: '1px solid rgba(108,99,255,0.3)',
          fontSize: '0.8rem',
          color: '#a78bfa',
          marginBottom: '1.5rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          AIE Bootcamp — Week 3
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 30%, #a78bfa 70%, #ff6584 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Decision Intelligence<br />Assistant
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#9ca3af',
          maxWidth: '520px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.7',
        }}>
          Compare RAG vs No-RAG answers and ML vs LLM priority predictions
          side by side — with live latency and cost metrics.
        </p>

        <button
          onClick={() => navigate('/assistant')}
          style={{
            padding: '0.85rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 0 32px rgba(108,99,255,0.35)',
            letterSpacing: '0.01em',
          }}
        >
          Try it now →
        </button>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 2rem 6rem',
      }}>
        {features.map((card, i) => (
          <div key={i} style={{
            backgroundColor: '#111127',
            padding: '1.5rem',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.07)',
            borderTop: `3px solid ${card.accent}`,
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{card.emoji}</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>
              {card.title}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0, lineHeight: '1.6' }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
