import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Auth context for a Django backend using session auth + CSRF cookie
 * (matches the pattern already used in lib/isp.js).
 *
 * ASSUMPTIONS — adjust these to match your real urls.py:
 *   - GET  /api/auth/user/    -> returns the current user, or 401/403 if
 *                                not logged in
 *   - POST /api/auth/login/   -> body: { username, password }, sets the
 *                                session cookie, returns the user
 *   - POST /api/auth/logout/  -> clears the session
 *   - The user object has at least { id, email }. full_name is optional —
 *     falls back to the email's local part if missing.
 *
 * If your backend uses JWT/token auth instead of sessions, the shape of
 * this file changes more: you'd store a token (e.g. in memory, not
 * localStorage, to avoid XSS risk) and send it as an Authorization header
 * instead of relying on cookies. Say the word and I'll rewrite it for that.
 */

const AuthContext = createContext(null);

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function normalizeUser(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    email: raw.email ?? "",
    fullName: raw.full_name || raw.email?.split("@")[0] || "Staff",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user/", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(normalizeUser(data));
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (username, password) => {
    const res = await fetch("/api/auth/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let message = "Invalid username or password";
      try {
        const data = await res.json();
        message = data.detail || Object.values(data).flat().join(" ") || message;
      } catch {
        // ignore non-JSON error body
      }
      throw new Error(message);
    }

    const data = await res.json();
    const normalized = normalizeUser(data);
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout/", {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
    });
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetchUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}