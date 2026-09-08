const problems = [
  {
    icon: '📋',
    bg: '#FEF2F2',
    title: 'Customer records in spreadsheets',
    desc: 'Searching through rows of data every time a customer calls. Duplicates, missing info, and outdated records slow your team down daily.',
  },
  {
    icon: '💸',
    bg: '#FFF7ED',
    title: 'Untracked payments and revenue leaks',
    desc: 'M-Pesa payments confirmed over WhatsApp, cash collected informally, invoices never sent. Revenue disappears and no one knows where.',
  },
  {
    icon: '📵',
    bg: '#FEF2F2',
    title: 'Support complaints lost in chats',
    desc: 'Customers report issues that get forgotten. No tracking, no assignment, no way to know if a problem was ever actually resolved.',
  },
]

export default function Problems() {
  return (
    <section className="lp-section lp-section-tint" id="problems">
      <div className="lp-section-inner">
        <p className="lp-section-eyebrow">The problem</p>
        <h2 className="lp-section-title">Sound familiar?</h2>
        <p className="lp-section-sub">
          These are the daily struggles ISPs across Kenya face without a proper management system.
        </p>
        <div className="lp-problems-grid">
          {problems.map((p, i) => (
            <div className="lp-prob-card" key={i}>
              <div className="lp-prob-icon" style={{ background: p.bg }}>
                <span style={{ fontSize: 22 }}>{p.icon}</span>
              </div>
              <h3 className="lp-prob-title">{p.title}</h3>
              <p className="lp-prob-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}