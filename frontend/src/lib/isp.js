/**
 * Data access for the ISP workspace.
 *
 * Talks to Django REST Framework ViewSet-style endpoints instead of Supabase.
 *
 * ASSUMPTIONS — adjust these to match your real urls.py:
 *   - API_BASE is "/api" and every resource is a standard DRF router route:
 *       /api/packages/        /api/customers/       /api/invoices/
 *       /api/payments/        /api/usage-stats/      /api/tickets/
 *       /api/audit-log/
 *     Rename any of these in the ENDPOINTS map below if yours differ.
 *   - Auth is Django's session auth + CSRF cookie (the default for DRF
 *     browsable API / SessionAuthentication). If you're using JWT/token auth
 *     instead, swap the Authorization header logic in `request()` below.
 *   - Audit logging happens server-side (e.g. via DRF signals or a custom
 *     save() override) rather than the frontend inserting audit rows itself.
 *     I removed the client-side logAudit() calls from every mutation for
 *     that reason — if your Django app does NOT log audits automatically,
 *     tell me and I'll add explicit POST /api/audit-log/ calls back in.
 */

const API_BASE = "/api";

const ENDPOINTS = {
  packages: `${API_BASE}/packages/`,
  customers: `${API_BASE}/customers/`,
  invoices: `${API_BASE}/invoices/`,
  payments: `${API_BASE}/payments/`,
  usage: `${API_BASE}/usage-stats/`,
  tickets: `${API_BASE}/tickets/`,
  audits: `${API_BASE}/audit-log/`,
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function request(url, options = {}) {
  const method = options.method ?? "GET";
  const needsCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  const res = await fetch(url, {
    ...options,
    method,
    credentials: "include", // send the Django session cookie
    headers: {
      "Content-Type": "application/json",
      ...(needsCsrf ? { "X-CSRFToken": getCookie("csrftoken") } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.detail || Object.values(data).flat().join(" ") || message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// DRF pagination returns { results: [...] } by default. This unwraps either
// a paginated response or a plain array so callers don't need to care.
function list(payload) {
  return Array.isArray(payload) ? payload : (payload?.results ?? []);
}

export const workspaceQueryKey = ["isp-workspace"];

export async function fetchWorkspace() {
  const [packages, customers, invoices, payments, usage, tickets, audits] = await Promise.all([
    request(`${ENDPOINTS.packages}?ordering=price`),
    request(`${ENDPOINTS.customers}?ordering=-created_at`),
    request(`${ENDPOINTS.invoices}?ordering=-due_date`),
    request(`${ENDPOINTS.payments}?ordering=-paid_at`),
    request(`${ENDPOINTS.usage}?ordering=stat_date`),
    request(`${ENDPOINTS.tickets}?ordering=-created_at`),
    request(`${ENDPOINTS.audits}?ordering=-created_at&limit=100`),
  ]);

  return {
    packages: list(packages),
    customers: list(customers),
    invoices: list(invoices),
    payments: list(payments),
    usage: list(usage),
    tickets: list(tickets),
    audits: list(audits),
  };
}

/* ── Mutations ─────────────────────────────────────────────────────────── */
// `actor` params were only used for client-side audit logging — dropped from
// the calls below since audit logging is assumed to happen server-side now.
// If your views need to know who's acting, that should come from the
// authenticated request (request.user) on the Django side, not the payload.

export async function createCustomer(input) {
  return request(ENDPOINTS.customers, { method: "POST", body: input });
}

export async function updateCustomerStatus(customer, status) {
  return request(`${ENDPOINTS.customers}${customer.id}/`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteCustomer(customer) {
  return request(`${ENDPOINTS.customers}${customer.id}/`, { method: "DELETE" });
}

export async function savePackage(input, id) {
  return id
    ? request(`${ENDPOINTS.packages}${id}/`, { method: "PATCH", body: input })
    : request(ENDPOINTS.packages, { method: "POST", body: input });
}

export async function togglePackageActive(pkg) {
  return request(`${ENDPOINTS.packages}${pkg.id}/`, {
    method: "PATCH",
    body: { is_active: !pkg.is_active },
  });
}

export async function createInvoice(input) {
  // Let the backend generate the reference (e.g. "INV-1234") if it doesn't
  // already — that's safer than generating it client-side as the original
  // Supabase version did.
  const invoice = await request(ENDPOINTS.invoices, { method: "POST", body: input });
  return invoice.reference;
}

export async function setInvoiceStatus(invoice, status) {
  return request(`${ENDPOINTS.invoices}${invoice.id}/`, { method: "PATCH", body: { status } });
}

export async function recordPayment(input) {
  const payment = await request(ENDPOINTS.payments, {
    method: "POST",
    body: { ...input, paid_at: new Date().toISOString() },
  });
  if (input.invoice_id) {
    await request(`${ENDPOINTS.invoices}${input.invoice_id}/`, {
      method: "PATCH",
      body: { status: "paid" },
    });
  }
  return payment;
}

export async function createTicket(input) {
  return request(ENDPOINTS.tickets, { method: "POST", body: { ...input, status: "open" } });
}

export async function setTicketStatus(ticket, status) {
  return request(`${ENDPOINTS.tickets}${ticket.id}/`, { method: "PATCH", body: { status } });
}

/* ── Formatting helpers (unchanged — framework agnostic) ──────────────── */

export const money = (value) =>
  `KES ${Number(value).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const shortDate = (value) =>
  new Date(value).toLocaleDateString("en-KE", { day: "2-digit", month: "short" });

export const longDate = (value) =>
  new Date(value).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

export const dateTime = (value) =>
  new Date(value).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const titleCase = (value) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const gb = (mb) => `${(mb / 1024).toFixed(1)} GB`;