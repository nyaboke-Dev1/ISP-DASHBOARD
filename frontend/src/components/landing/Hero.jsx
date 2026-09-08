import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="lp-hero">
      <div className="lp-hero-inner">
        <div className="lp-hero-badge">
          <span className="lp-badge-dot"></span>
          Built for Kenyan ISPs
        </div>
        <h1 className="lp-hero-h1">
          Manage your ISP business<br />from one dashboard
        </h1>
        <p className="lp-hero-sub">
          Stop juggling spreadsheets, WhatsApp groups, and paper records.
          ISP Dashboard centralizes your customers, invoices, payments,
          and support tickets in one secure place.
        </p>
        <div className="lp-hero-btns">
          <button className="lp-btn-hero-primary" onClick={() => navigate('/login')}>
            Get started free
          </button>
          <button className="lp-btn-hero-secondary" onClick={() => navigate('/login')}>
            Log in to dashboard
          </button>
        </div>
        <div className="lp-hero-stats">
          <div className="lp-stat">
            <span className="lp-stat-num">100%</span>
            <span className="lp-stat-label">Web-based, no install</span>
          </div>
          <div className="lp-stat-divider"></div>
          <div className="lp-stat">
            <span className="lp-stat-num">M-Pesa</span>
            <span className="lp-stat-label">Payment support built-in</span>
          </div>
          <div className="lp-stat-divider"></div>
          <div className="lp-stat">
            <span className="lp-stat-num">KES</span>
            <span className="lp-stat-label">Local currency ready</span>
          </div>
          <div className="lp-stat-divider"></div>
          <div className="lp-stat">
            <span className="lp-stat-num">24/7</span>
            <span className="lp-stat-label">Access from anywhere</span>
          </div>
        </div>
      </div>
    </section>
  )
}