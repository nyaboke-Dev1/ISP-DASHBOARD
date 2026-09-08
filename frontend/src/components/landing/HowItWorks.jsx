const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Sign up with your ISP details. Add your team members and assign them roles — Super Admin or Support Agent.',
  },
  {
    num: '02',
    title: 'Set up your packages',
    desc: 'Add your internet packages with speeds and pricing in KES. Then add your customers and assign them to packages.',
  },
  {
    num: '03',
    title: 'Start managing',
    desc: 'Record payments, track invoices, handle support tickets, and monitor network usage — all from one dashboard.',
  },
]

export default function HowItWorks() {
  return (
    <section className="lp-section lp-section-tint" id="how-it-works">
      <div className="lp-section-inner">
        <p className="lp-section-eyebrow">How it works</p>
        <h2 className="lp-section-title">Up and running in 3 steps</h2>
        <p className="lp-section-sub">
          No technical setup required. Your team can be managing customers within minutes of signing up.
        </p>
        <div className="lp-steps">
          {steps.map((s, i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-num">{s.num}</div>
              {i < steps.length - 1 && <div className="lp-step-line"></div>}
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}