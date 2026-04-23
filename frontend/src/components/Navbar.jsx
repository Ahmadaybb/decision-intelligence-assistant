import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#a78bfa' : '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: location.pathname === path ? '600' : '400',
    letterSpacing: '0.03em',
    paddingBottom: '2px',
    borderBottom: location.pathname === path ? '2px solid #a78bfa' : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  })

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: '64px',
      backgroundColor: 'rgba(15, 15, 35, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6c63ff 0%, #ff6584 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem',
        }}>🤖</div>
        <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white', letterSpacing: '-0.01em' }}>
          Decision Intelligence
        </span>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/assistant" style={linkStyle('/assistant')}>Assistant</Link>
        <Link to="/about" style={linkStyle('/about')}>About</Link>
      </div>
    </nav>
  )
}

export default Navbar
