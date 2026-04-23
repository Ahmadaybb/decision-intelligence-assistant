import Navbar from '../components/Navbar'

const card = (accentColor) => ({
  backgroundColor: '#111127',
  borderRadius: '14px',
  padding: '1.75rem',
  marginBottom: '1.25rem',
  border: '1px solid rgba(255,255,255,0.07)',
  borderLeft: `4px solid ${accentColor}`,
})

const sectionLabel = {
  fontSize: '0.72rem',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: '0.75rem',
}

const listItem = {
  color: '#9ca3af',
  lineHeight: '1.9',
  fontSize: '0.9rem',
}

function About() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a1a', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ ...sectionLabel, marginBottom: '0.5rem' }}>About</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 0.6rem' }}>
            Project Overview
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            AIE Bootcamp — Week 3 · Decision Intelligence Assistant
          </p>
        </div>

        <div style={card('#6c63ff')}>
          <p style={sectionLabel}>Architecture</p>
          <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>🏗️ System Components</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {[
              ['Frontend', 'React app — port 3000'],
              ['Backend', 'FastAPI service — port 8000'],
              ['Vector Store', 'ChromaDB persisted to disk'],
            ].map(([title, desc]) => (
              <li key={title} style={listItem}>
                <strong style={{ color: 'white' }}>{title}</strong> — {desc}
              </li>
            ))}
          </ul>
        </div>

        <div style={card('#10b981')}>
          <p style={sectionLabel}>Dataset</p>
          <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>📊 Training Data</h2>
          <p style={{ color: '#9ca3af', margin: 0, lineHeight: '1.7', fontSize: '0.9rem' }}>
            Customer Support on Twitter dataset, filtered to Amazon support conversations.{' '}
            <strong style={{ color: 'white' }}>8,381 conversation threads</strong> used for RAG retrieval.
          </p>
        </div>

        <div style={card('#a78bfa')}>
          <p style={sectionLabel}>Engineering</p>
          <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>🎯 Design Decisions</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {[
              ['Weak supervision', 'to generate priority labels'],
              ['all-MiniLM-L6-v2', 'for embeddings — local, zero cost'],
              ['Groq + LLaMA 3', 'for LLM generation — fast, free tier'],
              ['Logistic Regression', 'as final ML model — honest, no overfitting'],
              ['Amazon-only filter', 'for coherent, focused RAG context'],
            ].map(([title, desc]) => (
              <li key={title} style={listItem}>
                <strong style={{ color: 'white' }}>{title}</strong> — {desc}
              </li>
            ))}
          </ul>
        </div>

        <div style={card('#f59e0b')}>
          <p style={sectionLabel}>Limitations</p>
          <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>⚠️ Known Limitations</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {[
              'ML model learns labeling heuristics, not true urgency semantics',
              'Some mid-conversation tweets passed the conversation-starter filter',
              'Non-English tweets may have slipped through filtering',
              'RAG similarity threshold not enforced — low-similarity results still returned',
            ].map((item) => (
              <li key={item} style={listItem}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{
          ...card('#ef4444'),
          backgroundColor: 'rgba(239,68,68,0.06)',
          borderColor: 'rgba(239,68,68,0.4)',
        }}>
          <p style={{ ...sectionLabel, color: '#ef4444' }}>Production Recommendation</p>
          <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>🚀 At Scale: Use the ML Model</h2>
          <p style={{ color: '#9ca3af', margin: 0, lineHeight: '1.8', fontSize: '0.9rem' }}>
            At 10,000 tickets/hour, deploy the{' '}
            <strong style={{ color: 'white' }}>ML model</strong> for priority prediction.
            It runs in <strong style={{ color: '#10b981' }}>~2ms at $0</strong> vs{' '}
            <strong style={{ color: '#ef4444' }}>~1700ms at $0.0001/call</strong> for the LLM.
            The cost and latency gap is too large to justify at scale. Reserve the LLM for
            ambiguous cases flagged by the ML model.
          </p>
        </div>

      </div>
    </div>
  )
}

export default About
