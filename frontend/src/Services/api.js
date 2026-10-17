import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach token to every request ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auto-refresh token on 401 ─────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const res = await axios.post(`${API}/auth/refresh/`, { refresh })
        localStorage.setItem('access_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Endpoints ─────────────────────────────────────────────────
export const authAPI = {
  login:   (data)         => api.post('/auth/login/',  data),
  logout:  (refresh)      => api.post('/auth/logout/', { refresh }),
  refresh: (refresh)      => api.post('/auth/refresh/', { refresh }),
}

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary/'),
}

export const customersAPI = {
  list:       (search = '') => api.get(`/customers/${search ? `?search=${search}` : ''}`),
  create:     (data)        => api.post('/customers/', data),
  update:     (id, data)    => api.put(`/customers/${id}/`, data),
  delete:     (id)          => api.delete(`/customers/${id}/`),
  suspend:    (id)          => api.patch(`/customers/${id}/suspend/`),
  reactivate: (id)          => api.patch(`/customers/${id}/reactivate/`),
}

export const packagesAPI = {
  list:   ()         => api.get('/packages/'),
  create: (data)     => api.post('/packages/', data),
  update: (id, data) => api.put(`/packages/${id}/`, data),
  toggle: (id)       => api.patch(`/packages/${id}/toggle/`),
    delete: (id) => api.delete(`/packages/${id}/`),
}



export const invoicesAPI = {
  list: () => api.get("/invoices/"),
  create: (data) => api.post("/invoices/", data),
  update: (id, data) => api.patch(`/invoices/${id}/`, data),
  markPaid: (id) =>
    api.post(`/invoices/${id}/mark-paid/`),
};



export const paymentsAPI = {
  list:   ()     => api.get('/payments/'),
  create: (data) => api.post('/payments/', data),
}

export const ticketsAPI = {
  list:   () => api.get('/tickets/'),
  create: (data) => api.post('/tickets/', data),
  update: (id, data) => api.patch(`/tickets/${id}/`, data),
  close:  (id) => api.patch(`/tickets/${id}/close/`),
  assign: (id, data) => api.patch(`/tickets/${id}/assign/`, data),
};


export const networkAPI = {
  list: () => api.get('/network/usage/'),
  top:  () => api.get('/network/usage/top/'),
}

export const auditAPI = {
  list: () => api.get('/AuditLog/'),
}

export const settingsAPI = {
  getProfile: () => api.get("/settings/profile/"),
  updateProfile: (data) => api.patch("/settings/profile/", data),

  getPreferences: () => api.get("/settings/preferences/"),
  updatePreferences: (data) => api.patch("/settings/preferences/", data),

  changePassword: (data) => api.post("/settings/change-password/", data),

  getProfile: () => api.get("/settings/profile/"),
  updateProfile: (data) => api.patch("/settings/profile/", data),

  getOrganization: () => api.get("/settings/organization/"),
  updateOrganization: (data) => api.patch("/settings/organization/", data),

  getNotifications: () => api.get("/settings/notifications/"),
  updateNotifications: (data) => api.patch("/settings/notifications/", data),

  getPayments: () => api.get("/settings/payments/"),
  updatePayments: (data) => api.patch("/settings/payments/", data),

  changePassword: (data) => api.post("/settings/change-password/", data),

  getOrganization: () => api.get("/settings/organization/"),
  updateOrganization: (data) => api.patch("/settings/organization/", data),
};

export default api