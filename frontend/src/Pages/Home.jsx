import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Activity, BadgeDollarSign, Bell, Boxes, Check, ChevronDown,
  ChevronRight, CreditCard, FileText, History, LayoutDashboard,
  Menu, MoreHorizontal, Network, Plus, Search, Settings,
  Ticket, Trash2, UserRoundCheck, UserRoundX, Users, X, Wifi
} from 'lucide-react'

// ── Seed data ──────────────────────────────────────────────────────────────
const seed = {
  customers: [
    { id: 1, name: 'John Kamau',     phone: '0712 345 678', email: 'john.k@gmail.com',   location: 'Westlands, Nairobi',  packageId: 1, status: 'Active',    balance: 0,    createdAt: '2024-01-15' },
    { id: 2, name: 'Mary Wanjiku',   phone: '0722 987 654', email: 'mary.w@outlook.com',  location: 'Kilimani, Nairobi',   packageId: 2, status: 'Active',    balance: 4500, createdAt: '2024-02-10' },
    { id: 3, name: 'David Otieno',   phone: '0733 112 233', email: 'david.o@yahoo.com',   location: 'Ruiru, Kiambu',       packageId: 1, status: 'Suspended', balance: 5000, createdAt: '2023-11-20' },
    { id: 4, name: 'Sarah Mutua',    phone: '0700 554 433', email: 'sarah.m@gmail.com',   location: 'Section 9, Thika',    packageId: 3, status: 'Active',    balance: 0,    createdAt: '2024-03-05' },
    { id: 5, name: 'Kevin Omari',    phone: '0711 223 344', email: 'kevin.o@gmail.com',   location: 'South B, Nairobi',    packageId: 2, status: 'Pending',   balance: 0,    createdAt: '2024-07-10' },
    { id: 6, name: 'Alice Njeri',    phone: '0755 667 788', email: 'alice.n@gmail.com',   location: 'Kasarani, Nairobi',   packageId: 1, status: 'Active',    balance: 0,    createdAt: '2024-04-12' },
    { id: 7, name: 'Brian Kipkorir', phone: '0788 990 011', email: 'brian.k@gmail.com',   location: 'Kikuyu, Kiambu',      packageId: 2, status: 'Active',    balance: 0,    createdAt: '2024-05-20' },
    { id: 8, name: 'Grace Achieng',  phone: '0744 332 211', email: 'grace.a@gmail.com',   location: 'Embakasi, Nairobi',   packageId: 1, status: 'Active',    balance: 0,    createdAt: '2024-06-01' },
  ],
  packages: [
    { id: 1, name: 'Home Basic',   speedMbps: 10, price: 2500,  cycle: 'Monthly', active: true, description: 'Reliable everyday connectivity for homes and small households.' },
    { id: 2, name: 'Home Premium', speedMbps: 20, price: 4500,  cycle: 'Monthly', active: true, description: 'Faster streaming and work-from-home connectivity.' },
    { id: 3, name: 'Business Pro', speedMbps: 50, price: 10500, cycle: 'Monthly', active: true, description: 'Priority bandwidth for growing businesses.' },
  ],
  invoices: [
    { id: 'INV-1001', customerId: 1, amount: 2500,  dueDate: '2024-07-01', status: 'Paid' },
    { id: 'INV-1002', customerId: 2, amount: 4500,  dueDate: '2024-07-01', status: 'Unpaid' },
    { id: 'INV-1003', customerId: 3, amount: 2500,  dueDate: '2024-06-01', status: 'Overdue' },
    { id: 'INV-1004', customerId: 3, amount: 2500,  dueDate: '2024-07-01', status: 'Overdue' },
    { id: 'INV-1005', customerId: 4, amount: 10500, dueDate: '2024-07-05', status: 'Paid' },
    { id: 'INV-1006', customerId: 6, amount: 2500,  dueDate: '2024-07-10', status: 'Paid' },
    { id: 'INV-1007', customerId: 7, amount: 4500,  dueDate: '2024-07-15', status: 'Unpaid' },
    { id: 'INV-1008', customerId: 8, amount: 2500,  dueDate: '2024-07-20', status: 'Unpaid' },
  ],
  payments: [
    { id: 1, customerId: 1, amount: 2500,  method: 'M-Pesa', reference: 'QHJ7K2LM9P', invoiceId: 'INV-1001', paidAt: '14 Jul 2024, 10:30' },
    { id: 2, customerId: 4, amount: 10500, method: 'Bank',   reference: 'TRX882910',   invoiceId: 'INV-1005', paidAt: '14 Jul 2024, 09:10' },
    { id: 3, customerId: 6, amount: 2500,  method: 'M-Pesa', reference: 'RLM3N4OP5Q', invoiceId: 'INV-1006', paidAt: '13 Jul 2024, 16:40' },
    { id: 4, customerId: 2, amount: 4500,  method: 'M-Pesa', reference: 'ABC1D2EF3G', invoiceId: null,       paidAt: '13 Jul 2024, 13:20' },
  ],
  tickets: [
    { id: 'TKT-101', customerId: 2, subject: 'Internet connection dropping', priority: 'High',   status: 'Open',   assignee: 'Tech Support', createdAt: '14 Jul 2024, 14:00' },
    { id: 'TKT-102', customerId: 3, subject: 'Suspension query',             priority: 'Medium', status: 'Open',   assignee: 'Billing',      createdAt: '14 Jul 2024, 09:30' },
    { id: 'TKT-103', customerId: 5, subject: 'New installation status',      priority: 'Low',    status: 'Open',   assignee: 'Admin',        createdAt: '13 Jul 2024, 11:45' },
    { id: 'TKT-104', customerId: 1, subject: 'Router upgrade',               priority: 'Low',    status: 'Closed', assignee: 'Admin',        createdAt: '12 Jul 2024, 16:20' },
    { id: 'TKT-105', customerId: 4, subject: 'Slow speeds',                  priority: 'High',   status: 'Open',   assignee: 'Tech Support', createdAt: '12 Jul 2024, 10:10' },
  ],
  usage: [
    { date: '08 Jul', uploadMb: 4500,  downloadMb: 28000 },
    { date: '09 Jul', uploadMb: 5200,  downloadMb: 31000 },
    { date: '10 Jul', uploadMb: 4800,  downloadMb: 29500 },
    { date: '11 Jul', uploadMb: 6100,  downloadMb: 35000 },
    { date: '12 Jul', uploadMb: 5800,  downloadMb: 33000 },
    { date: '13 Jul', uploadMb: 7200,  downloadMb: 42000 },
    { date: '14 Jul', uploadMb: 6500,  downloadMb: 38000 },
  ],
  audits: [
    { id: 1, action: 'Closed ticket',      target: 'TKT-104',      actor: 'System Admin', timestamp: '14 Jul 2024, 10:15', ip: '192.168.1.50' },
    { id: 2, action: 'Created customer',   target: 'Kevin Omari',  actor: 'System Admin', timestamp: '14 Jul 2024, 09:20', ip: '192.168.1.50' },
    { id: 3, action: 'Recorded payment',   target: 'INV-1006',     actor: 'System Admin', timestamp: '13 Jul 2024, 16:45', ip: '192.168.1.50' },
    { id: 4, action: 'Updated ticket',     target: 'TKT-101',      actor: 'Support 1',    timestamp: '13 Jul 2024, 14:10', ip: '192.168.1.52' },
    { id: 5, action: 'Suspended customer', target: 'David Otieno', actor: 'System Admin', timestamp: '13 Jul 2024, 11:30', ip: '192.168.1.50' },
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────────
const money   = (v) => `KES ${Number(v).toLocaleString('en-KE')}`
const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

const pillStyle = (v) => {
  if (['Active', 'Paid', 'Closed'].includes(v))    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  if (['Overdue', 'Suspended'].includes(v))         return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
  if (['Unpaid', 'Pending', 'Open'].includes(v))    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  return 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
}

const priorityDot = (p) =>
  p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'

// ── Reusable UI ────────────────────────────────────────────────────────────
function Pill({ value }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${pillStyle(value)}`}>
      {value}
    </span>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="ml-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm
        text-slate-900 outline-none placeholder:text-slate-400
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${className}`}
    />
  )
}

function Sel({ className = '', ...props }) {
  return (
    <select
      {...props}
      className={`h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm
        text-slate-900 outline-none
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${className}`}
    />
  )
}

function Btn({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition active:scale-[.98] disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    ghost:   'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    danger:  'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  }
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

function Tbl({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 text-left text-xs">{children}</table>
    </div>
  )
}

function Th({ children }) {
  return (
    <th className="bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 first:rounded-tl-xl last:rounded-tr-xl">
      {children}
    </th>
  )
}

function Td({ children, className = '' }) {
  return (
    <td className={`border-t border-slate-100 px-4 py-3 text-slate-600 ${className}`}>
      {children}
    </td>
  )
}

function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
          ISP Dashboard
        </p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function Avatar({ name, size = 'sm' }) {
  const sz = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs'
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700 ${sz}`}>
      {initials(name)}
    </div>
  )
}

// ── NAV CONFIG ─────────────────────────────────────────────────────────────
const NAV = [
  ['Dashboard',       LayoutDashboard],
  ['Customers',       Users],
  ['Packages',        Boxes],
  ['Invoices',        FileText],
  ['Payments',        CreditCard],
  ['Network Usage',   Network],
  ['Support Tickets', Ticket],
  ['Audit Log',       History],
]

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────
function Dashboard({ data, onPage }) {
  const active   = data.customers.filter((c) => c.status === 'Active').length
  const overdue  = data.invoices.filter((i) => i.status === 'Overdue').length
  const openTkts = data.tickets.filter((t) => t.status === 'Open').length
  const revenue  = data.payments.reduce((s, p) => s + p.amount, 0)

  const maxDown = Math.max(...data.usage.map((u) => u.downloadMb), 1)
  const maxUp   = Math.max(...data.usage.map((u) => u.uploadMb),   1)

  const kpis = [
    { label: 'Active customers',   value: active,         note: '+8.2% this month',       icon: Users,           cls: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue this month', value: money(revenue), note: '+12.5% vs last month',   icon: BadgeDollarSign,  cls: 'bg-emerald-50 text-emerald-600' },
    { label: 'Overdue invoices',   value: overdue,        note: 'KES 10,000 outstanding', icon: FileText,         cls: 'bg-rose-50 text-rose-600' },
    { label: 'Open tickets',       value: openTkts,       note: '3 high priority',        icon: Ticket,           cls: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map(({ label, value, note, icon: Icon, cls }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 truncate">{label}</p>
                <p className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 truncate">{value}</p>
                <p className="mt-1 text-[11px] text-slate-400">{note}</p>
              </div>
              <div className={`shrink-0 rounded-lg p-2 ${cls}`}>
                <Icon size={16} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* Network chart */}
        <Card className="p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Network traffic</p>
              <p className="mt-0.5 text-xs text-slate-500">Upload & download — last 7 days</p>
            </div>
            <button onClick={() => onPage('Network Usage')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View details
            </button>
          </div>
          <div className="flex h-44 items-end gap-2 rounded-lg bg-slate-50 px-3 pb-3 pt-3">
            {data.usage.map((u, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-36 w-full items-end justify-center gap-0.5">
                  <div className="w-1/2 rounded-t bg-blue-600" style={{ height: `${Math.max(6, (u.downloadMb / maxDown) * 100)}%` }} />
                  <div className="w-1/2 rounded-t bg-blue-200" style={{ height: `${Math.max(6, (u.uploadMb   / maxUp)   * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">{u.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-600" />Download</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-200" />Upload</span>
          </div>
        </Card>

        {/* Package performance */}
        <Card className="p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Package performance</p>
              <p className="mt-0.5 text-xs text-slate-500">Subscribers by plan</p>
            </div>
            <Boxes size={15} className="text-blue-500" />
          </div>
          <div className="space-y-4">
            {data.packages.map((plan) => {
              const count = data.customers.filter((c) => c.packageId === plan.id).length
              const pct   = Math.round((count / (data.customers.length || 1)) * 100)
              return (
                <div key={plan.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{plan.name}</span>
                    <span className="text-slate-400">{count} subscribers</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => onPage('Packages')}
            className="mt-5 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Manage packages <ChevronRight size={13} />
          </button>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Recent customers */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Recent customers</p>
              <p className="mt-0.5 text-xs text-slate-500">Latest accounts on your network</p>
            </div>
            <button onClick={() => onPage('Customers')} className="text-xs font-semibold text-blue-600">View all</button>
          </div>
          <Tbl>
            <thead>
              <tr><Th>Customer</Th><Th>Location</Th><Th>Package</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {[...data.customers]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 5)
                .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={c.name} />
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.phone}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>{c.location}</Td>
                    <Td>{data.packages.find((p) => p.id === c.packageId)?.name}</Td>
                    <Td><Pill value={c.status} /></Td>
                  </tr>
                ))}
            </tbody>
          </Tbl>
        </Card>

        {/* Open tickets */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Open tickets</p>
            <p className="mt-0.5 text-xs text-slate-500">Need attention</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.tickets.filter((t) => t.status === 'Open').slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => onPage('Support Tickets')}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <div className={`h-2 w-2 shrink-0 rounded-full ${priorityDot(t.priority)}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{t.subject}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{t.id} · {t.assignee}</p>
                </div>
                <ChevronRight size={13} className="shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── CUSTOMERS PAGE ─────────────────────────────────────────────────────────
const CUST_EMPTY = { name: '', phone: '', email: '', location: '', packageId: '1', status: 'Active' }

function Customers({ data, setData, query }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(CUST_EMPTY)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const customers = data.customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email} ${c.location}`.toLowerCase().includes(query.toLowerCase())
  )

  const submit = (e) => {
    e.preventDefault()
    const c = { id: Date.now(), ...form, packageId: Number(form.packageId), balance: 0, createdAt: new Date().toISOString().slice(0, 10) }
    setData((cur) => ({
      ...cur,
      customers: [c, ...cur.customers],
      audits: [{ id: Date.now(), action: 'Created customer', target: c.name, actor: 'System Admin', timestamp: 'Just now', ip: '127.0.0.1' }, ...cur.audits],
    }))
    setOpen(false); setForm(CUST_EMPTY)
    toast.success('Customer added')
  }

  const toggle = (id) => setData((cur) => ({
    ...cur,
    customers: cur.customers.map((c) => c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c),
  }))

  const remove = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return
    setData((cur) => ({ ...cur, customers: cur.customers.filter((c) => c.id !== id) }))
    toast.success('Customer removed')
  }

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage subscribers, service plans, and account status."
        action={<Btn variant="primary" onClick={() => setOpen(true)}><Plus size={13} /> Add customer</Btn>}
      />

      {/* Stats strip */}
      <div className="mb-4 flex flex-wrap gap-3">
        {['Active', 'Suspended', 'Pending'].map((s) => (
          <div key={s} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s}</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">{data.customers.filter((c) => c.status === s).length}</p>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Tbl>
          <thead>
            <tr><Th>Customer</Th><Th>Location</Th><Th>Package</Th><Th>Status</Th><Th>Balance</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-xs text-slate-400">No customers found</td></tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="transition hover:bg-slate-50/60">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={c.name} />
                    <div>
                      <p className="font-semibold text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <p>{c.location}</p>
                  <p className="text-[10px] text-slate-400">{c.phone}</p>
                </Td>
                <Td>{data.packages.find((p) => p.id === c.packageId)?.name}</Td>
                <Td><Pill value={c.status} /></Td>
                <Td className="font-semibold">{money(c.balance)}</Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <Btn variant="ghost" className="h-7 px-2" onClick={() => toggle(c.id)}>
                      {c.status === 'Active' ? <UserRoundX size={12} /> : <UserRoundCheck size={12} />}
                    </Btn>
                    <button onClick={() => remove(c.id, c.name)} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </Card>

      {open && (
        <Modal title="Add customer" subtitle="Register a new subscriber" onClose={() => { setOpen(false); setForm(CUST_EMPTY) }}>
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Full name"><Input required value={form.name} onChange={set('name')} placeholder="e.g. Jane Mwangi" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Phone"><Input required value={form.phone} onChange={set('phone')} placeholder="0712 345 678" /></Field>
              <Field label="Email"><Input required type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" /></Field>
            </div>
            <Field label="Location"><Input required value={form.location} onChange={set('location')} placeholder="Kahawa, Nairobi" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Package">
                <Sel value={form.packageId} onChange={set('packageId')}>
                  {data.packages.filter((p) => p.active).map((p) => <option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}
                </Sel>
              </Field>
              <Field label="Status">
                <Sel value={form.status} onChange={set('status')}>
                  <option>Active</option><option>Pending</option><option>Suspended</option>
                </Sel>
              </Field>
            </div>
            <div className="mt-1 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Btn variant="ghost" type="button" onClick={() => { setOpen(false); setForm(CUST_EMPTY) }}>Cancel</Btn>
              <Btn variant="primary" type="submit">Save customer</Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

// ── PACKAGES PAGE ──────────────────────────────────────────────────────────
const PKG_EMPTY = { name: '', speedMbps: '', price: '', cycle: 'Monthly', description: '' }

function Packages({ data, setData }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(PKG_EMPTY)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const plan = { id: Date.now(), name: form.name, speedMbps: Number(form.speedMbps), price: Number(form.price), cycle: form.cycle, description: form.description, active: true }
    setData((cur) => ({ ...cur, packages: [...cur.packages, plan] }))
    setOpen(false); setForm(PKG_EMPTY)
    toast.success('Package created')
  }

  const toggleActive = (id) =>
    setData((cur) => ({ ...cur, packages: cur.packages.map((p) => p.id === id ? { ...p, active: !p.active } : p) }))

  return (
    <>
      <PageHeader
        title="Service packages"
        description="Control the internet plans available to your subscribers."
        action={<Btn variant="primary" onClick={() => setOpen(true)}><Plus size={13} /> Add package</Btn>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.packages.map((plan) => {
          const subs = data.customers.filter((c) => c.packageId === plan.id).length
          return (
            <Card key={plan.id} className={`p-5 transition ${!plan.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Wifi size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{plan.speedMbps} Mbps</p>
                    <p className="font-bold text-slate-900">{plan.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(plan.id)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${plan.active ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${plan.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">
                {money(plan.price)}
                <span className="ml-1 text-xs font-normal text-slate-400">/ {plan.cycle}</span>
              </p>
              <p className="mt-2 min-h-8 text-xs leading-relaxed text-slate-500">{plan.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-500">Subscribers</span>
                <strong className="text-slate-900">{subs}</strong>
              </div>
            </Card>
          )
        })}
      </div>

      {open && (
        <Modal title="Add package" subtitle="Create a new internet plan" onClose={() => { setOpen(false); setForm(PKG_EMPTY) }}>
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Package name"><Input required value={form.name} onChange={set('name')} placeholder="Business Plus" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Speed (Mbps)"><Input required type="number" min="1" value={form.speedMbps} onChange={set('speedMbps')} /></Field>
              <Field label="Price (KES)"><Input required type="number" min="0" value={form.price} onChange={set('price')} /></Field>
            </div>
            <Field label="Billing cycle">
              <Sel value={form.cycle} onChange={set('cycle')}>
                <option>Monthly</option><option>Quarterly</option><option>Annual</option>
              </Sel>
            </Field>
            <Field label="Description"><Input value={form.description} onChange={set('description')} placeholder="Brief description" /></Field>
            <div className="mt-1 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Btn variant="ghost" type="button" onClick={() => { setOpen(false); setForm(PKG_EMPTY) }}>Cancel</Btn>
              <Btn variant="primary" type="submit">Create package</Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

// ── INVOICES PAGE ──────────────────────────────────────────────────────────
function Invoices({ data, setData }) {
  const [filter, setFilter] = useState('All')
  const counts  = ['All', 'Unpaid', 'Overdue', 'Paid'].reduce((acc, f) => ({ ...acc, [f]: f === 'All' ? data.invoices.length : data.invoices.filter((i) => i.status === f).length }), {})
  const invoices = data.invoices.filter((i) => filter === 'All' || i.status === filter)

  const settle = (id) => {
    setData((cur) => ({ ...cur, invoices: cur.invoices.map((i) => i.id === id ? { ...i, status: 'Paid' } : i) }))
    toast.success('Invoice marked as paid')
  }

  return (
    <>
      <PageHeader title="Invoices" description="Review billing status and settle outstanding balances." />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-4 py-2.5">
          {['All', 'Unpaid', 'Overdue', 'Paid'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition
                ${filter === f ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>{counts[f]}</span>
            </button>
          ))}
        </div>
        <Tbl>
          <thead><tr><Th>Invoice</Th><Th>Customer</Th><Th>Amount</Th><Th>Due date</Th><Th>Status</Th><Th>Action</Th></tr></thead>
          <tbody>
            {invoices.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-xs text-slate-400">No invoices</td></tr>}
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition hover:bg-slate-50/60">
                <Td className="font-semibold text-slate-800">{inv.id}</Td>
                <Td>{data.customers.find((c) => c.id === inv.customerId)?.name}</Td>
                <Td className="font-semibold">{money(inv.amount)}</Td>
                <Td>{inv.dueDate}</Td>
                <Td><Pill value={inv.status} /></Td>
                <Td>{inv.status !== 'Paid' && <Btn variant="primary" className="h-7" onClick={() => settle(inv.id)}><Check size={11} /> Mark paid</Btn>}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </Card>
    </>
  )
}

// ── PAYMENTS PAGE ──────────────────────────────────────────────────────────
const PAY_EMPTY = { customerId: '', amount: '', method: 'M-Pesa', reference: '', invoiceId: '' }
const METHOD_CLS = { 'M-Pesa': 'bg-emerald-50 text-emerald-700', Bank: 'bg-blue-50 text-blue-700', Cash: 'bg-amber-50 text-amber-700' }

function Payments({ data, setData }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(PAY_EMPTY)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const handleInvoice = (e) => {
    const inv = data.invoices.find((i) => i.id === e.target.value)
    setForm((p) => ({ ...p, invoiceId: e.target.value, amount: inv ? String(inv.amount) : p.amount }))
  }

  const submit = (e) => {
    e.preventDefault()
    setData((cur) => ({
      ...cur,
      payments: [{ id: Date.now(), customerId: Number(form.customerId), amount: Number(form.amount), method: form.method, reference: form.reference, invoiceId: form.invoiceId || null, paidAt: 'Just now' }, ...cur.payments],
      invoices: form.invoiceId ? cur.invoices.map((i) => i.id === form.invoiceId ? { ...i, status: 'Paid' } : i) : cur.invoices,
      customers: form.invoiceId ? cur.customers.map((c) => c.id === Number(form.customerId) ? { ...c, balance: Math.max(0, c.balance - Number(form.amount)) } : c) : cur.customers,
    }))
    setOpen(false); setForm(PAY_EMPTY)
    toast.success('Payment recorded')
  }

  const totalRevenue = data.payments.reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <PageHeader
        title="Payments"
        description="Record collections and reconcile linked invoices."
        action={<Btn variant="primary" onClick={() => setOpen(true)}><Plus size={13} /> Record payment</Btn>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total collected',  value: money(totalRevenue) },
          { label: 'M-Pesa payments',  value: data.payments.filter((p) => p.method === 'M-Pesa').length },
          { label: 'Other payments',   value: data.payments.filter((p) => p.method !== 'M-Pesa').length },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Tbl>
          <thead><tr><Th>Date</Th><Th>Customer</Th><Th>Amount</Th><Th>Method</Th><Th>Reference</Th><Th>Invoice</Th></tr></thead>
          <tbody>
            {data.payments.map((p) => (
              <tr key={p.id} className="transition hover:bg-slate-50/60">
                <Td>{p.paidAt}</Td>
                <Td>{data.customers.find((c) => c.id === p.customerId)?.name}</Td>
                <Td className="font-semibold">{money(p.amount)}</Td>
                <Td><span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${METHOD_CLS[p.method] ?? 'bg-slate-50 text-slate-600'}`}>{p.method}</span></Td>
                <Td className="font-mono text-[11px]">{p.reference}</Td>
                <Td>{p.invoiceId ?? <span className="text-slate-400">Unlinked</span>}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </Card>

      {open && (
        <Modal title="Record payment" subtitle="Link to an invoice to update the ledger" onClose={() => { setOpen(false); setForm(PAY_EMPTY) }}>
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Customer">
              <Sel required value={form.customerId} onChange={set('customerId')}>
                <option value="">Select customer</option>
                {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Sel>
            </Field>
            <Field label="Linked invoice">
              <Sel value={form.invoiceId} onChange={handleInvoice}>
                <option value="">No linked invoice</option>
                {data.invoices.filter((i) => i.status !== 'Paid').map((i) => <option key={i.id} value={i.id}>{i.id} · {money(i.amount)}</option>)}
              </Sel>
            </Field>
            <Field label="Amount (KES)"><Input required type="number" min="1" value={form.amount} onChange={set('amount')} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Method">
                <Sel value={form.method} onChange={set('method')}>
                  <option>M-Pesa</option><option>Bank</option><option>Cash</option>
                </Sel>
              </Field>
              <Field label="Transaction ref"><Input required value={form.reference} onChange={set('reference')} placeholder="QHJ7K2LM9P" /></Field>
            </div>
            <div className="mt-1 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Btn variant="ghost" type="button" onClick={() => { setOpen(false); setForm(PAY_EMPTY) }}>Cancel</Btn>
              <Btn variant="primary" type="submit">Record payment</Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

// ── TICKETS PAGE ───────────────────────────────────────────────────────────
const TKT_EMPTY = { customerId: '', subject: '', priority: 'Medium', assignee: 'Admin' }

function Tickets({ data, setData }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(TKT_EMPTY)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const t = { id: `TKT-${String(Date.now()).slice(-4)}`, customerId: Number(form.customerId), subject: form.subject, priority: form.priority, assignee: form.assignee, status: 'Open', createdAt: 'Just now' }
    setData((cur) => ({ ...cur, tickets: [t, ...cur.tickets] }))
    setOpen(false); setForm(TKT_EMPTY)
    toast.success('Ticket created')
  }

  const close = (id) => {
    setData((cur) => ({ ...cur, tickets: cur.tickets.map((t) => t.id === id ? { ...t, status: 'Closed' } : t) }))
    toast.success('Ticket closed')
  }

  return (
    <>
      <PageHeader
        title="Support tickets"
        description="Assign, prioritize, and close customer support requests."
        action={<Btn variant="primary" onClick={() => setOpen(true)}><Plus size={13} /> New ticket</Btn>}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        {[
          { label: 'Open',        count: data.tickets.filter((t) => t.status === 'Open').length,   cls: 'text-rose-600' },
          { label: 'In Progress', count: data.tickets.filter((t) => t.status === 'In Progress').length, cls: 'text-amber-600' },
          { label: 'Closed',      count: data.tickets.filter((t) => t.status === 'Closed').length, cls: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-0.5 text-lg font-bold ${s.cls}`}>{s.count}</p>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Tbl>
          <thead><tr><Th>Ticket</Th><Th>Customer</Th><Th>Subject</Th><Th>Priority</Th><Th>Status</Th><Th>Assigned to</Th><Th>Action</Th></tr></thead>
          <tbody>
            {data.tickets.map((t) => (
              <tr key={t.id} className="transition hover:bg-slate-50/60">
                <Td className="font-semibold text-slate-800">{t.id}</Td>
                <Td>{data.customers.find((c) => c.id === t.customerId)?.name}</Td>
                <Td>{t.subject}</Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    <i className={`h-2 w-2 rounded-full ${priorityDot(t.priority)}`} />
                    {t.priority}
                  </span>
                </Td>
                <Td><Pill value={t.status} /></Td>
                <Td>{t.assignee}</Td>
                <Td>{t.status === 'Open' && <Btn variant="ghost" className="h-7" onClick={() => close(t.id)}>Close</Btn>}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </Card>

      {open && (
        <Modal title="Create ticket" subtitle="Log a new customer issue" onClose={() => { setOpen(false); setForm(TKT_EMPTY) }}>
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Customer">
              <Sel required value={form.customerId} onChange={set('customerId')}>
                <option value="">Select customer</option>
                {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Sel>
            </Field>
            <Field label="Subject"><Input required value={form.subject} onChange={set('subject')} placeholder="Describe the issue" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Priority">
                <Sel value={form.priority} onChange={set('priority')}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </Sel>
              </Field>
              <Field label="Assign to">
                <Sel value={form.assignee} onChange={set('assignee')}>
                  <option>Admin</option><option>Billing</option><option>Tech Support</option>
                </Sel>
              </Field>
            </div>
            <div className="mt-1 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Btn variant="ghost" type="button" onClick={() => { setOpen(false); setForm(TKT_EMPTY) }}>Cancel</Btn>
              <Btn variant="primary" type="submit">Create ticket</Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

// ── AUDIT LOG PAGE ─────────────────────────────────────────────────────────
function AuditLog({ data }) {
  return (
    <>
      <PageHeader title="Audit log" description="A read-only record of all administrative activity." />
      <Card className="overflow-hidden">
        <Tbl>
          <thead><tr><Th>Timestamp</Th><Th>Actor</Th><Th>Action</Th><Th>Target</Th><Th>IP address</Th></tr></thead>
          <tbody>
            {data.audits.map((a) => (
              <tr key={a.id} className="transition hover:bg-slate-50/60">
                <Td>{a.timestamp}</Td>
                <Td className="font-semibold text-slate-800">{a.actor}</Td>
                <Td><span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">{a.action}</span></Td>
                <Td>{a.target}</Td>
                <Td className="font-mono text-[11px]">{a.ip}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      </Card>
    </>
  )
}

// ── NETWORK USAGE PAGE ─────────────────────────────────────────────────────
function NetworkUsage({ data }) {
  const maxDown = Math.max(...data.usage.map((u) => u.downloadMb), 1)
  const maxUp   = Math.max(...data.usage.map((u) => u.uploadMb),   1)

  return (
    <>
      <PageHeader title="Network usage" description="Monitor traffic trends and top subscribers." />
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-900">Seven-day traffic</p>
          <p className="mt-0.5 text-xs text-slate-500">Aggregate upload and download in GB</p>
          <div className="mt-5 flex h-64 items-end gap-3 rounded-lg border-b border-l border-slate-200 px-3 pb-3">
            {data.usage.map((u) => (
              <div key={u.date} className="flex flex-1 items-end justify-center gap-1">
                <div className="w-1/2 rounded-t bg-blue-600" style={{ height: `${Math.max(6, (u.downloadMb / maxDown) * 100)}%` }} />
                <div className="w-1/2 rounded-t bg-blue-200" style={{ height: `${Math.max(6, (u.uploadMb   / maxUp)   * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between px-2 text-[11px] text-slate-400">
            {data.usage.map((u) => <span key={u.date}>{u.date}</span>)}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-600" />Download</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-200" />Upload</span>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-900">Usage leaders</p>
          <p className="mt-0.5 text-xs text-slate-500">Top subscribers by traffic</p>
          <div className="mt-4 space-y-3">
            {data.customers.slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-4 text-[10px] font-bold text-slate-400">0{i + 1}</span>
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{data.packages.find((p) => p.id === c.packageId)?.name}</p>
                </div>
                <strong className="text-xs text-slate-700">
                  {Math.round(((data.usage[i % data.usage.length]?.uploadMb ?? 0) + (data.usage[i % data.usage.length]?.downloadMb ?? 0)) / 1024)} GB
                </strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

// ── HOME (ROOT LAYOUT) ─────────────────────────────────────────────────────
export default function Home() {
  const [page,       setPage]       = useState('Dashboard')
  const [data,       setData]       = useState(seed)
  const [query,      setQuery]      = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openTickets = data.tickets.filter((t) => t.status === 'Open').length

  const content = useMemo(() => {
    if (page === 'Dashboard')       return <Dashboard    data={data} onPage={setPage} />
    if (page === 'Customers')       return <Customers    data={data} setData={setData} query={query} />
    if (page === 'Packages')        return <Packages     data={data} setData={setData} />
    if (page === 'Invoices')        return <Invoices     data={data} setData={setData} />
    if (page === 'Payments')        return <Payments     data={data} setData={setData} />
    if (page === 'Support Tickets') return <Tickets      data={data} setData={setData} />
    if (page === 'Audit Log')       return <AuditLog     data={data} />
    return                                 <NetworkUsage data={data} />
  }, [data, page, query])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-slate-200 bg-white
        transition-transform duration-200 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-100 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">ISP Dashboard</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 lg:hidden">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
          <nav className="space-y-0.5">
            {NAV.map(([label, Icon]) => {
              const active = page === label
              return (
                <button
                  key={label}
                  onClick={() => { setPage(label); setSidebarOpen(false) }}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition
                    ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="flex-1 text-left">{label}</span>
                  {label === 'Support Tickets' && openTickets > 0 && (
                    <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                      {openTickets}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          <p className="mb-2 mt-6 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</p>
          <button className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
            <Settings size={15} className="text-slate-400 group-hover:text-slate-600" />
            Settings
          </button>
        </div>

        {/* Admin profile */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">SA</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">System Admin</p>
              <p className="truncate text-[10px] text-slate-400">admin@ispdashboard.co.ke</p>
            </div>
            <MoreHorizontal size={14} className="shrink-0 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu size={16} />
            </button>
            <div>
              <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
                Workspace / {page}
              </p>
              <p className="text-sm font-bold text-slate-900">
                {page === 'Dashboard' ? 'Good morning, Admin 👋' : page}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers…"
                className="h-8 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 lg:w-52"
              />
            </div>

            {/* Bell */}
            <button className="relative rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>

            <div className="hidden h-5 w-px bg-slate-200 sm:block" />

            {/* Avatar */}
            <button className="hidden items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-50 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">SA</div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {content}
          </div>
        </main>
      </div>
    </div>
  )
}