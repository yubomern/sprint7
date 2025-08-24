// src/api.js
const API = import.meta.env.VITE_APP_BASE_URL|| 'http://localhost:4000';

export const apiFetch = async (path, { method='GET', token, body, headers } = {}) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
  // auto logout on 401
  if (res.status === 401) {
    // trigger your logout flow (redux/action)
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth:logout'));
    throw new Error('Unauthorized');
  }
  return res.json();
};
