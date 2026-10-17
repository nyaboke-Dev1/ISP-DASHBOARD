import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  if (token) {
    try {
      // Decode user info directly from the JWT token
      // No API call needed — avoids the /auth/me/ 404
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({
        id:       payload.user_id,
        username: 'System Admin',
        email:    'admin@ispdashboard.co.ke',
        fullName: 'System Admin',
      })
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  } else {
    setLoading(false)
  }
}, [token])

  
const login = async (username, password) => {
  const res = await axios.post(`${API}/auth/login/`, {
    username,
    password,
  });

  const { access, refresh } = res.data;

  if (!access || !refresh) {
    throw new Error(
      "Login response did not contain access and refresh tokens."
    );
  }

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  setToken(access);

  return res.data;
};


  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      await axios.post(`${API}/auth/logout/`, { refresh }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {}
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}