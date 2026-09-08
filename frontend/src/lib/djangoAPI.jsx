const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

async function request(path, token, init) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`, 
      ...init?.headers 
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Django API request failed with ${response.status}`);
  }
  return response.json();
}

export function getDashboardSummary(token) {
  return request("/dashboard/summary/", token);
}

export function listCustomers(token, search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/customers/${query}`, token);
}

export function createPayment(token, payload) {
  return request("/payments/", token, { method: "POST", body: JSON.stringify(payload) });
}