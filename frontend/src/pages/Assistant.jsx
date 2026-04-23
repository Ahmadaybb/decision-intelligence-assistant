import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STYLES = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-warn {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); opacity: 1; }
    50%       { box-shadow: 0 0 0 7px rgba(245,158,11,0); opacity: 0.8; }
  }
  @keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card {
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .card:hover {
    box-shadow:
      0 0 0 1px rgba(108,99,255,0.55),
      0 0 0 3px rgba(255,101,132,0.12),
      0 10px 36px rgba(108,99,255,0.13);
  }
  .badge-disagree {
    animation: pulse-warn 1.8s ease-in-out infinite;
  }
`

const cardStyle = (extra = {}) => ({
  backgroundColor: '#111127',
  borderRadius: '14px',
  padding: '1.5rem',
  border: '1px solid rgba(255,255,255,0.07)',
  ...extra,
})

const badge = (color) => ({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  fontSize: '0.72rem',
  fontWeight: '600',
  backgroundColor: `${color}20`,
  color: color,
  border: `1px solid ${color}40`,
})

const sectionTitle = (color = 'white') => ({
  margin: '0 0 1rem',
  fontSize: '0.8rem',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color,
})

const dimText = { color: '#6b7280', fontSize: '0.85rem' }

function ConfidenceBar({ value, color }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ ...dimText, fontSize: '0.75rem' }}>Confidence</span>
        <span style={{ ...dimText, fontSize: '0.75rem', fontWeight: '600', color }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div style={{
          height: '100%', borderRadius: '999px',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

function PriorityBadge({ priority, large }) {
  const colors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' }
  const c = colors[priority] || '#9ca3af'
  return (
    <span style={{
      display: 'inline-block',
      padding: large ? '0.4rem 1rem' : '0.35rem 0.9rem',
      borderRadius: '8px',
      fontWeight: '800',
      fontSize: large ? '1.1rem' : '1rem',
      backgroundColor: `${c}18`,
      color: c,
      border: `1px solid ${c}40`,
      letterSpacing: '0.04em',
    }}>{priority}</span>
  )
}

function EmptyState({ text }) {
  return <p style={{ ...dimText, fontStyle: 'italic', margin: '0.5rem 0 0' }}>{text}</p>
}

function LogEntry({ log }) {
  const color = log.startsWith('❌') ? '#ef4444' : log.startsWith('✅') ? '#10b981' : '#a78bfa'
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
      padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontSize: '0.75rem', color, marginTop: '1px', flexShrink: 0 }}>●</span>
      <span style={{ fontSize: '0.8rem', color: '#d1d5db', lineHeight: '1.4' }}>
        {log.replace(/^[✅❌🔍⚡]\s?/, '')}
      </span>
    </div>
  )
}

function SummaryBar({ ragData, predictionData }) {
  if (!ragData || !predictionData) return null
  const priority = predictionData.ml_prediction.prediction
  const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' }
  const pc = priorityColors[priority] || '#9ca3af'
  const confidence = Math.round(predictionData.ml_prediction.confidence * 100)

  const items = [
    {
      label: 'ML Priority',
      value: priority,
      valueColor: pc,
      icon: '⚡',
      accent: pc,
    },
    {
      label: 'Confidence',
      value: `${confidence}%`,
      valueColor: '#a78bfa',
      icon: '📊',
      accent: '#6c63ff',
    },
    {
      label: 'RAG Latency',
      value: `${ragData.rag_answer.latency}ms`,
      valueColor: '#6c63ff',
      icon: '🔍',
      accent: '#6c63ff',
    },
    {
      label: 'ML Latency',
      value: `${predictionData.ml_prediction.latency}ms`,
      valueColor: '#10b981',
      icon: '🤖',
      accent: '#10b981',
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.75rem',
      marginBottom: '1.5rem',
      animation: 'fade-in-down 0.4s ease',
    }}>
      {items.map(({ label, value, valueColor, icon, accent }) => (
        <div
          key={label}
          className="card"
          style={{
            ...cardStyle({ padding: '1rem 1.25rem' }),
            borderTop: `2px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </p>
            <p style={{ margin: '0.1rem 0 0', fontSize: '1rem', fontWeight: '800', color: valueColor, letterSpacing: '-0.01em' }}>
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Assistant() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [ragData, setRagData] = useState(null)
  const [predictionData, setPredictionData] = useState(null)

  const addLog = (msg) => setLogs(prev => [...prev, msg])

  const handleSubmit = async () => {
    if (!query.trim()) return
    setLoading(true)
    setLogs([])
    setRagData(null)
    setPredictionData(null)

    try {
      addLog('✅ Query received')

      addLog('⚡ Running priority predictions...')
      const predResponse = await axios.post('http://localhost:8000/predict/priority', { query })
      setPredictionData(predResponse.data)
      addLog(`✅ ML prediction: ${predResponse.data.ml_prediction.prediction} (${predResponse.data.ml_prediction.latency}ms)`)
      addLog(`✅ LLM prediction: ${predResponse.data.llm_prediction.prediction} (${predResponse.data.llm_prediction.latency}ms)`)

      addLog('🔍 Retrieving similar tickets...')
      const ragResponse = await axios.post('http://localhost:8000/rag/ask', { query })
      setRagData(ragResponse.data)
      addLog(`✅ Retrieved ${ragResponse.data.rag_answer.retrieved_tickets.length} similar tickets`)
      addLog(`✅ RAG answer generated (${ragResponse.data.rag_answer.latency}ms)`)
      addLog(`✅ No-RAG answer generated (${ragResponse.data.no_rag_answer.latency}ms)`)

    } catch (error) {
      addLog('❌ Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const mlMatch = predictionData &&
    predictionData.ml_prediction.prediction === predictionData.llm_prediction.prediction

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a1a', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <style>{STYLES}</style>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Query Input */}
        <div
          className="card"
          style={{
            ...cardStyle({ padding: '1.25rem', marginBottom: '1.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }),
            borderTop: '3px solid #6c63ff',
          }}
        >
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask a customer support question — e.g. 'My order hasn't arrived in 2 weeks'"
            style={{
              flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem',
              backgroundColor: 'rgba(255,255,255,0.05)', color: 'white',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '0.75rem 1.75rem',
              background: loading ? '#2d2d4e' : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              color: loading ? '#6b7280' : 'white',
              border: 'none', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem', fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: loading ? 'none' : '0 0 20px rgba(108,99,255,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '12px', height: '12px', border: '2px solid #6b7280',
                  borderTopColor: '#a78bfa', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.8s linear infinite',
                }} />
                Thinking...
              </span>
            ) : 'Analyze →'}
          </button>
        </div>

        {/* Summary Bar */}
        <SummaryBar ragData={ragData} predictionData={predictionData} />

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Live Logs */}
            <div className="card" style={cardStyle()}>
              <h3 style={sectionTitle('#a78bfa')}>Live Process</h3>
              {logs.length === 0
                ? <EmptyState text="Waiting for query..." />
                : logs.map((log, i) => <LogEntry key={i} log={log} />)
              }
            </div>

            {/* Retrieved Sources */}
            <div className="card" style={cardStyle()}>
              <h3 style={sectionTitle('#6c63ff')}>Retrieved Sources</h3>
              {!ragData
                ? <EmptyState text="No sources retrieved yet." />
                : ragData.rag_answer.retrieved_tickets.map((ticket, i) => (
                  <div key={i} style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '0.6rem',
                    borderLeft: '3px solid #6c63ff40',
                  }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={badge('#6c63ff')}>
                        sim {(1 - ticket.distance).toFixed(2)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', margin: 0, color: '#d1d5db', lineHeight: '1.5' }}>
                      {ticket.text}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Priority Prediction Comparison */}
            <div className="card" style={cardStyle()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ ...sectionTitle('white'), margin: 0 }}>⚡ Priority Prediction Comparison</h3>
                {predictionData && (
                  <span
                    className={mlMatch ? '' : 'badge-disagree'}
                    style={badge(mlMatch ? '#10b981' : '#f59e0b')}
                  >
                    {mlMatch ? '✓ Models agree' : '⚠ Models disagree'}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                {/* ML Model */}
                <div style={{
                  backgroundColor: 'rgba(108,99,255,0.06)',
                  borderRadius: '10px', padding: '1.25rem',
                  border: '1px solid rgba(108,99,255,0.2)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ML Model
                    </h4>
                    <span style={{ ...dimText, fontSize: '0.7rem' }}>Logistic Regression</span>
                  </div>

                  {predictionData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <PriorityBadge priority={predictionData.ml_prediction.prediction} />
                      <ConfidenceBar value={predictionData.ml_prediction.confidence} color="#6c63ff" />
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={badge('#10b981')}>⚡ {predictionData.ml_prediction.latency}ms</span>
                        <span style={badge('#10b981')}>$0 / call</span>
                      </div>
                    </div>
                  ) : <EmptyState text="Waiting..." />}
                </div>

                {/* LLM Zero-shot */}
                <div style={{
                  backgroundColor: 'rgba(255,101,132,0.06)',
                  borderRadius: '10px', padding: '1.25rem',
                  border: '1px solid rgba(255,101,132,0.2)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#ff6584', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      LLM Zero-shot
                    </h4>
                    <span style={{ ...dimText, fontSize: '0.7rem' }}>LLaMA 3 via Groq</span>
                  </div>

                  {predictionData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <PriorityBadge priority={predictionData.llm_prediction.prediction} />
                      <div style={{ height: '4px' }} />
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={badge('#f59e0b')}>⏱ {predictionData.llm_prediction.latency}ms</span>
                        <span style={badge('#ef4444')}>$0.0001 / call</span>
                      </div>
                    </div>
                  ) : <EmptyState text="Waiting..." />}
                </div>
              </div>

              {/* Latency comparison bar */}
              {predictionData && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ ...dimText, margin: '0 0 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Latency comparison
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { label: 'ML Model', value: predictionData.ml_prediction.latency, color: '#6c63ff', max: Math.max(predictionData.ml_prediction.latency, predictionData.llm_prediction.latency) },
                      { label: 'LLM Zero-shot', value: predictionData.llm_prediction.latency, color: '#ff6584', max: Math.max(predictionData.ml_prediction.latency, predictionData.llm_prediction.latency) },
                    ].map(({ label, value, color, max }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{label}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color }}>{value}ms</span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          <div style={{
                            height: '100%', borderRadius: '999px',
                            width: `${Math.max((value / max) * 100, 1)}%`,
                            backgroundColor: color,
                            transition: 'width 0.8s ease',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RAG vs No-RAG */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

              {/* RAG Answer */}
              <div className="card" style={cardStyle({ borderTop: '3px solid #6c63ff' })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ ...sectionTitle('#6c63ff'), margin: 0 }}>🔍 RAG Answer</h3>
                  {ragData && (
                    <span style={badge('#6c63ff')}>{ragData.rag_answer.latency}ms</span>
                  )}
                </div>
                {ragData
                  ? <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.7', color: '#e5e7eb' }}>
                      {ragData.rag_answer.answer}
                    </p>
                  : <EmptyState text="Waiting..." />
                }
              </div>

              {/* No-RAG Answer */}
              <div className="card" style={cardStyle({ borderTop: '3px solid #ff6584' })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ ...sectionTitle('#ff6584'), margin: 0 }}>🤖 No-RAG Answer</h3>
                  {ragData && (
                    <span style={badge('#ff6584')}>{ragData.no_rag_answer.latency}ms</span>
                  )}
                </div>
                {ragData
                  ? <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.7', color: '#e5e7eb' }}>
                      {ragData.no_rag_answer.answer}
                    </p>
                  : <EmptyState text="Waiting..." />
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Assistant
