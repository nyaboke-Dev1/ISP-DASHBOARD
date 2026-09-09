import {
  Activity,
  Bell,
  Cable,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Network,
  Package,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
const navGroups = [
  {
    label: "Command",
    items: [{ label: "Overview", path: "/dashboard", icon: LayoutDashboard, section: "dashboard" }]
  },
  {
    label: "Subscribers",
    items: [
      { label: "Clients", path: "/clients", icon: Users, section: "clients" },
      { label: "Packages", path: "/packages", icon: Package, section: "packages" }
    ]
  },
  {
    label: "Revenue",
    items: [
      { label: "Invoices", path: "/invoices", icon: ReceiptText, section: "invoices" },
      { label: "Payments", path: "/payments", icon: CreditCard, section: "payments" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Network", path: "/network", icon: Network, section: "network" },
      { label: "Tickets", path: "/tickets", icon: ClipboardList, section: "tickets" }
    ]
  },
  {
    label: "Control",
    items: [
      { label: "Audit log", path: "/audit-log", icon: ShieldCheck, section: "audit-log" },
      { label: "Settings", path: "/settings", icon: Settings, section: "settings" }
    ]
  }
];
const pageMeta = {
  dashboard: { code: "OP\u201301", title: "Command overview", description: "Observe the signals that need your attention." },
  clients: { code: "CL\u201302", title: "Client directory", description: "Find, qualify, and act on subscriber records." },
  packages: { code: "PR\u201303", title: "Service packages", description: "Shape the offer and monitor its adoption." },
  invoices: { code: "FN\u201304", title: "Invoice desk", description: "Keep billing runs, due amounts, and collections aligned." },
  payments: { code: "FN\u201305", title: "Payment control", description: "Reconcile cash movement with a clear exception trail." },
  network: { code: "NW\u201306", title: "Network map", description: "Read capacity, reach, and service risk as one field." },
  tickets: { code: "CS\u201307", title: "Support queue", description: "Prioritize the incidents that affect service confidence." },
  "audit-log": { code: "CT\u201308", title: "Audit log", description: "Maintain a traceable record of every control action." },
  settings: { code: "AD\u201309", title: "System settings", description: "Define the operational defaults behind the command center." }
};
export function BrandMark({ inverse = false, compact = false }) {
  return <span className="flex items-center gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded-[13px] ${inverse ? "bg-white/12" : "bg-[#1758e8]/10"}`}>
        <img src="/manus-storage/northline-route-mark_ef41e5f5.png" alt="Northline routing mark" className="h-7 w-7 object-contain" />
      </span>
      {!compact && <span className="leading-none">
          <span className={`block text-[15px] font-bold tracking-[-0.06em] ${inverse ? "text-white" : "text-[#14213d]"}`}>NORTHLINE</span>
          <span className={`mt-1 block text-[9px] font-bold tracking-[0.24em] ${inverse ? "text-white/55" : "text-[#6d7890]"}`}>SIGNAL ATLAS</span>
        </span>}
    </span>;
}
export function AppShell({ section, children }) {
  const [location] = useLocation();
  const page = pageMeta[section];
  const quickNav = navGroups.flatMap((group) => group.items);
  return <div className="min-h-screen bg-[#f4f5f8] text-[#14213d] md:flex">
      <aside className="sticky top-0 z-30 hidden h-screen w-[272px] shrink-0 flex-col border-r border-white/10 bg-[#101d35] md:flex">
        <div className="relative flex h-[94px] items-center border-b border-white/10 px-7 before:absolute before:bottom-0 before:left-0 before:h-px before:w-14 before:bg-[#1758e8]">
          <Link href="/dashboard" aria-label="Open command overview"><BrandMark inverse /></Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Primary navigation">
          {navGroups.map((group) => <div key={group.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
    const Icon = item.icon;
    const active = location === item.path;
    return <Link
      key={item.path}
      href={item.path}
      className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition-all duration-200 ${active ? "bg-white/10 text-white" : "text-[#a8b7d1] hover:bg-white/[0.055] hover:text-white"}`}
    >
                      {active && <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[#1758e8]" />}
                      <Icon className="h-4 w-4" strokeWidth={active ? 2.35 : 1.85} />
                      <span>{item.label}</span>
                      {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                    </Link>;
  })}
              </div>
            </div>)}
        </nav>
        <div className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-[#17294a] p-4 text-white before:absolute before:inset-0 before:opacity-30 before:[background-image:linear-gradient(rgba(152,184,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(152,184,255,0.12)_1px,transparent_1px)] before:[background-size:18px_18px]">
          <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9eb8ff]"><Activity className="h-3.5 w-3.5" /> System status</div>
          <p className="mt-3 text-sm font-semibold">99.96% availability</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[88%] rounded-full bg-[#6ee7c8]" /></div>
          <p className="mt-2 text-[11px] text-white/55">One amber signal requires review.</p>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[#f4f5f8] [background-image:linear-gradient(rgba(23,88,232,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(23,88,232,0.026)_1px,transparent_1px)] [background-size:42px_42px]">
        <header className="sticky top-0 z-20 border-b border-[#dfe4ed] bg-[#f4f5f8]/95 backdrop-blur-xl">
          <div className="flex min-h-[94px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 md:hidden"><Link href="/dashboard"><BrandMark compact /></Link></div>
            <div className="hidden min-w-0 md:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1758e8]"><span className="mr-2 inline-block h-2 w-[3px] bg-[#1758e8] align-middle" />{page.code}</p>
              <h1 className="mt-1 text-xl font-bold tracking-[-0.045em] text-[#14213d] sm:text-[22px]">{page.title}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="hidden h-10 w-[240px] items-center gap-2 rounded-xl border border-[#dfe4ed] bg-white px-3 text-[#8490a5] lg:flex">
                <Search className="h-4 w-4" />
                <input aria-label="Search command center" placeholder="Search client, invoice, node…" className="min-w-0 flex-1 bg-transparent text-xs text-[#14213d] outline-none placeholder:text-[#9ca6b7]" />
                <kbd className="rounded bg-[#eef1f5] px-1.5 py-0.5 text-[9px] font-bold text-[#8791a2]">⌘K</kbd>
              </label>
              <button type="button" aria-label="View notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#dfe4ed] bg-white text-[#59677f] transition hover:-translate-y-0.5 hover:border-[#cbd6eb] hover:text-[#1758e8] active:scale-[0.97]"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f7aa3a]" /></button>
              <button type="button" className="flex h-10 items-center gap-2 rounded-xl bg-[#14213d] px-3 text-xs font-bold text-white transition hover:bg-[#223253] active:scale-[0.97]"><span className="grid h-5 w-5 place-items-center rounded-md bg-[#6ee7c8] text-[9px] text-[#16352e]">JR</span><span className="hidden sm:block">J. Reid</span></button>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-[#e7eaf0] px-4 py-2 md:hidden">
            {quickNav.map((item) => {
    const Icon = item.icon;
    const active = location === item.path;
    return <Link key={item.path} href={item.path} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${active ? "bg-[#e9f0ff] text-[#1758e8]" : "text-[#68758b]"}`}><Icon className="h-3.5 w-3.5" />{item.label}</Link>;
  })}
          </div>
        </header>
        <div className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mb-7 flex items-start justify-between gap-5 md:hidden">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1758e8]">{page.code}</p><h1 className="mt-1 text-xl font-bold tracking-[-0.045em]">{page.title}</h1></div>
            <SlidersHorizontal className="mt-1 h-5 w-5 text-[#7b879a]" />
          </div>
          <p className="mb-8 hidden max-w-xl text-sm leading-6 text-[#6d7890] md:block">{page.description}</p>
          {children}
        </div>
      </main>
    </div>;
}
export function SectionHeading({ kicker, title, detail, action }) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#7f8aa0]">{kicker}</p><h2 className="mt-1 text-[15px] font-bold tracking-[-0.025em] text-[#182542]">{title}</h2>{detail && <p className="mt-1 text-xs text-[#768299]">{detail}</p>}</div>{action}</div>;
}
export function Panel({ children, className = "" }) {
  const hasCustomBackground = /(^|\s)bg-/.test(className);
  return <section className={`relative overflow-hidden rounded-xl border border-[#dce3ed] shadow-[0_8px_22px_rgba(26,40,70,0.035)] ${hasCustomBackground ? "" : "bg-white"} [background-image:linear-gradient(rgba(23,88,232,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(23,88,232,0.022)_1px,transparent_1px)] [background-size:26px_26px] ${className}`}>{children}</section>;
}
export function StatusPill({ children, tone = "neutral" }) {
  const tones = { good: "bg-[#e6f8f1] text-[#147960]", warn: "bg-[#fff4de] text-[#a7640b]", bad: "bg-[#feebe8] text-[#c85345]", blue: "bg-[#e9f0ff] text-[#1758e8]", neutral: "bg-[#f0f2f6] text-[#6c7890]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${tones[tone]}`}><span className={`h-1.5 w-1.5 rounded-full ${tone === "good" ? "bg-[#28ae88]" : tone === "warn" ? "bg-[#eea42f]" : tone === "bad" ? "bg-[#e05b50]" : tone === "blue" ? "bg-[#1758e8]" : "bg-[#98a3b5]"}`} />{children}</span>;
}
export function MetricCard({ label, value, detail, trend = "up", icon: Icon }) {
  const trendText = trend === "up" ? "text-[#168263]" : trend === "down" ? "text-[#c85345]" : "text-[#7b8799]";
  return <Panel className="relative overflow-hidden p-5"><span className="absolute left-0 top-5 h-8 w-[3px] rounded-r-full bg-[#1758e8]" /><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f8aa0]">{label}</p><p className="mt-3 text-2xl font-bold tracking-[-0.055em] text-[#172441] tabular-nums">{value}</p><p className={`mt-2 text-[11px] font-semibold ${trendText}`}>{detail}</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0f4ff] text-[#1758e8]"><Icon className="h-4 w-4" /></span></div></Panel>;
}
export function WireframeNote() {
  return <div className="mt-7 flex items-center gap-2 rounded-xl border border-dashed border-[#cfd8ea] bg-[#f9fbff] px-3 py-2.5 text-[11px] text-[#68758c]"><Cable className="h-3.5 w-3.5 shrink-0 text-[#1758e8]" />Illustrative wireframe data — connect live provisioning, CRM, billing, and NMS services in production.</div>;
}
