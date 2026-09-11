import axios from 'axios'

// Base URL pointing to your Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor — attach JWT token to every request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle token expiry ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // If 401 and not already retried
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refresh = localStorage.getItem('refresh_token')
        const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh,
        })

        const newAccess = res.data.access
        localStorage.setItem('access_token', newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`

        return api(original)
      } catch {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────
export const login  = (credentials) => api.post('/auth/login/',   credentials)
export const logout = (refresh)     => api.post('/auth/logout/',  { refresh })

// ── Dashboard ─────────────────────────────────────────────────
export const getDashboardSummary = () => api.get('/dashboard/summary/')

// ── Customers ─────────────────────────────────────────────────
export const getCustomers    = (search = '') => api.get(`/customers/${search ? `?search=${search}` : ''}`)
export const createCustomer  = (data)        => api.post('/customers/', data)
export const updateCustomer  = (id, data)    => api.put(`/customers/${id}/`, data)
export const deleteCustomer  = (id)          => api.delete(`/customers/${id}/`)
export const suspendCustomer = (id)          => api.patch(`/customers/${id}/suspend/`)
export const reactivateCustomer = (id)       => api.patch(`/customers/${id}/reactivate/`)

// ── Packages ──────────────────────────────────────────────────
export const getPackages   = ()          => api.get('/packages/')
export const createPackage = (data)      => api.post('/packages/', data)
export const updatePackage = (id, data)  => api.put(`/packages/${id}/`, data)
export const togglePackage = (id)        => api.patch(`/packages/${id}/toggle/`)

// ── Invoices ──────────────────────────────────────────────────
export const getInvoices  = (status = '') => api.get(`/invoices/${status ? `?status=${status}` : ''}`)
export const markInvoicePaid = (id)       => api.patch(`/invoices/${id}/pay/`)

// ── Payments ──────────────────────────────────────────────────
export const getPayments    = ()     => api.get('/payments/')
export const createPayment  = (data) => api.post('/payments/', data)

// ── Tickets ───────────────────────────────────────────────────
export const getTickets    = ()          => api.get('/tickets/')
export const createTicket  = (data)      => api.post('/tickets/', data)
export const closeTicket   = (id)        => api.patch(`/tickets/${id}/close/`)
export const assignTicket  = (id, data)  => api.patch(`/tickets/${id}/assign/`, data)

// ── Network usage ─────────────────────────────────────────────
export const getNetworkUsage = () => api.get('/network/usage/')

// ── Audit log ─────────────────────────────────────────────────
export const getAuditLog = () => api.get('/audit-log/')

export default api