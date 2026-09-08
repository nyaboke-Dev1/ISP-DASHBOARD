export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-logo">
          <div className="lp-nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <circle cx="12" cy="20" r="1" fill="white" stroke="none"/>
            </svg>
          </div>
          <span className="lp-footer-name">ISP Dashboard</span>
        </div>
        <p className="lp-footer-copy">© 2026 ISP Dashboard. Built for Kenyan ISPs.</p>
        <div className="lp-footer-links">
          <a href="#" className="lp-footer-link">Privacy</a>
          <a href="#" className="lp-footer-link">Terms</a>
          <a href="#" className="lp-footer-link">Contact</a>
        </div>
      </div>
    </footer>
  )
}