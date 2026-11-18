/**
 * Eco-Saathi API Service Client
 * Connects frontend UI to backend REST API at http://localhost:5000
 */

// Use relative URL so Vite proxy forwards requests to http://localhost:5000
const API_BASE_URL = "";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}

export async function getIssues(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/api/issues${query ? `?${query}` : ''}`);
  return res.json();
}

export async function getIssueById(id) {
  const res = await fetch(`${API_BASE_URL}/api/issues/${id}`);
  return res.json();
}

export async function reportIssue(formData) {
  const res = await fetch(`${API_BASE_URL}/report`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function uploadVoiceNote(file) {
  const formData = new FormData();
  formData.append('voiceNote', file);
  const res = await fetch(`${API_BASE_URL}/uploadVoice`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function analyzeWithAI(data) {
  const res = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateIssueStatus(id, updateData) {
  const res = await fetch(`${API_BASE_URL}/api/issues/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  return res.json();
}

export async function getOverviewAnalytics() {
  const res = await fetch(`${API_BASE_URL}/api/analytics/overview`);
  return res.json();
}

export async function getDepartments() {
  const res = await fetch(`${API_BASE_URL}/api/departments`);
  return res.json();
}

export async function createDepartment(data) {
  const res = await fetch(`${API_BASE_URL}/api/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getAdmins() {
  const res = await fetch(`${API_BASE_URL}/api/admin/admins`);
  return res.json();
}

export async function createAdmin(data) {
  const res = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return res.json();
}

export async function getNotifications(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/api/notifications${query ? `?${query}` : ''}`);
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
    method: 'PATCH'
  });
  return res.json();
}

export { API_BASE_URL };
