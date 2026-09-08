import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="lp-nav">
      <div className="lp-nav-logo">
        <div className="lp-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1" fill="white" stroke="none"/>
          </svg>
        </div>
        <span className="lp-nav-name">ISP Dashboard</span>
      </div>
      <div className="lp-nav-links">
        <button className="lp-nav-link" onClick={() => scrollTo('features')}>Features</button>
        <button className="lp-nav-link" onClick={() => scrollTo('how-it-works')}>How it works</button>
        <button className="lp-nav-link" onClick={() => scrollTo('problems')}>Why us</button>
      </div>
      <div className="lp-nav-actions">
        <button className="lp-btn-outline" onClick={() => navigate('/login')}>Log in</button>
        <button className="lp-btn-primary" onClick={() => navigate('/login')}>Get started</button>
      </div>
    </nav>
  )
}