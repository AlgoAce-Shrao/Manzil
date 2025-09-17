// client/js/api.js
const API_BASE = (window.API_BASE && window.API_BASE + '/api') || "http://localhost:5000/api";

async function apiGet(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}${path}${qs ? '?' + qs : ''}`;
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

async function apiPost(path, body = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}
