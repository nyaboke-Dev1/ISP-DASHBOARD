const features = [
  {
    icon: '👥',
    bg: '#EFF6FF',
    title: 'Customer management',
    desc: 'Add, search, suspend, and reactivate customers instantly. Full profile with package, balance, and full history.',
  },
  {
    icon: '🧾',
    bg: '#F0FDF4',
    title: 'Invoice tracking',
    desc: 'Generate and track invoices per customer. Filter by paid, unpaid, and overdue. Never miss a billing cycle.',
  },
  {
    icon: '📱',
    bg: '#F0FDF4',
    title: 'M-Pesa payments',
    desc: 'Record M-Pesa, cash, and bank payments with transaction references. Every shilling accounted for.',
  },
  {
    icon: '📡',
    bg: '#EFF6FF',
    title: 'Network usage',
    desc: 'Track daily upload and download per customer. Spot heavy users and enforce fair-use policies with real data.',
  },
  {
    icon: '🎫',
    bg: '#FFFBEB',
    title: 'Support tickets',
    desc: 'Log, assign, and resolve customer complaints in a structured workflow. No complaint falls through the cracks.',
  },
  {
    icon: '🔐',
    bg: '#F5F3FF',
    title: 'Audit log',
    desc: 'Every admin action is automatically logged — who did what, when, and from which device. Full accountability.',
  },
]

export default function Features() {
  return (
    <section className="lp-section" id="features">
      <div className="lp-section-inner">
        <p className="lp-section-eyebrow">Features</p>
        <h2 className="lp-section-title">Everything your ISP needs</h2>
        <p className="lp-section-sub">
          Six modules that replace every spreadsheet, paper record, and WhatsApp group your team relies on today.
        </p>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div className="lp-feat-card" key={i}>
              <div className="lp-feat-icon" style={{ background: f.bg }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
              </div>
              <h3 className="lp-feat-title">{f.title}</h3>
              <p className="lp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}