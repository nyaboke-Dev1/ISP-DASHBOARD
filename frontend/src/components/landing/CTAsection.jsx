import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="lp-cta">
      <div className="lp-cta-inner">
        <h2 className="lp-cta-title">
          Ready to bring order to your ISP operations?
        </h2>
        <p className="lp-cta-sub">
          Join ISPs across Kenya who have ditched the spreadsheets for a system that actually works.
        </p>
        <div className="lp-cta-btns">
          <button className="lp-btn-hero-primary" onClick={() => navigate('/login')}>
            Get started free
          </button>
          <button
            className="lp-btn-hero-secondary lp-btn-hero-secondary--light"
            onClick={() => navigate('/login')}
          >
            Log in to dashboard
          </button>
        </div>
      </div>
    </section>
  )
}