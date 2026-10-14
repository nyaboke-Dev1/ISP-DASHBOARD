import {
  customersAPI,
  packagesAPI,
  invoicesAPI,
  paymentsAPI,
  ticketsAPI,
  networkAPI,
  auditAPI,
} from '@/Services/api'

// ── Query key — used by react-query everywhere ────────────────
export const workspaceQueryKey = ['workspace']

// ── Main fetch — called by useWorkspace() ─────────────────────
export async function fetchWorkspace() {
  const [
    customers,
    packages,
    invoices,
    payments,
    tickets,
    usage,
    audit,
  ] = await Promise.all([
    customersAPI.list(),
    packagesAPI.list(),
    invoicesAPI.list(),
    paymentsAPI.list(),
    ticketsAPI.list(),
    networkAPI.list(),
    auditAPI.list(),
  ])

  return {
    customers: customers.data.results ?? customers.data ?? [],
    packages:  packages.data.results  ?? packages.data  ?? [],
    invoices:  invoices.data.results  ?? invoices.data  ?? [],
    payments:  payments.data.results  ?? payments.data  ?? [],
    tickets:   tickets.data.results   ?? tickets.data   ?? [],
    usage:     usage.data.results     ?? usage.data     ?? [],
    audits:    audit.data.results     ?? audit.data     ?? [],
  }
}

// ── Formatting helpers ─────────────────────────────────────────
export const money = (value) =>
  `KES ${Number(value || 0).toLocaleString('en-KE')}`

export const gb = (mb) => {
  if (!mb) return '0 MB'
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${Math.round(mb)} MB`
}

export const shortDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', {
    month: 'short',
    day:   'numeric',
  })
}

export const longDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}
export const titleCase = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
export const updateCustomerStatus = (id, status) => {
  if (status === 'active') return customersAPI.reactivate(id)
  if (status === 'suspended') return customersAPI.suspend(id)
  return customersAPI.update(id, { status })
}
export const savePackage = (data, id = null) => {
  if (id) return packagesAPI.update(id, data)
  return packagesAPI.create(data)
}
export const togglePackageActive = (id) => packagesAPI.toggle(id)

export const recordPayment = (data) => paymentsAPI.create(data)

export const setInvoiceStatus = (id, status) => {
  if (status === 'paid') return invoicesAPI.markPaid(id)
  return invoicesAPI.create({ id, status })
}

export const dateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-KE', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export const setTicketStatus = (id, status) => {
  if (status === 'closed') return ticketsAPI.close(id)
  return ticketsAPI.assign(id, { status })
}

export const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
// ── Actions — used by dialog components ───────────────────────
export const createCustomer   = (data)      => customersAPI.create(data)
export const updateCustomer   = (id, data)  => customersAPI.update(id, data)
export const deleteCustomer   = (id)        => customersAPI.delete(id)
export const suspendCustomer  = (id)        => customersAPI.suspend(id)
export const reactivateCustomer = (id)      => customersAPI.reactivate(id)

export const createPackage    = (data)      => packagesAPI.create(data)
export const togglePackage    = (id)        => packagesAPI.toggle(id)

export const deletePackage = (id) => packagesAPI.delete(id);

export const createInvoice    = (data)      => invoicesAPI.create(data)
export const markInvoicePaid  = (id)        => invoicesAPI.markPaid(id)

export const createPayment    = (data)      => paymentsAPI.create(data)

export const createTicket     = (data)      => ticketsAPI.create(data)
export const closeTicket      = (id)        => ticketsAPI.close(id)
export const assignTicket     = (id, data)  => ticketsAPI.assign(id, data)