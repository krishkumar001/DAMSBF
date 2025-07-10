// src/services/api.js
// IMPORTANT: If your backend is not running on http://localhost:5000/api,
// create a .env file in your project root with:
// VITE_API_URL=http://localhost:5000/api
// Replace the port if your backend runs on a different one.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Add auth header if token exists
const getHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...customHeaders,
  };
};

export async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: getHeaders(options.headers),
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => fetchData(endpoint),
  post: (endpoint, data) => fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => fetchData(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => fetchData(endpoint, {
    method: 'DELETE',
  }),
};

// Auth-specific API functions
export const authAPI = {
  register: (userData) => api.post('auth/register', userData),
  login: (credentials) => api.post('auth/login', credentials),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => api.get('auth/me'),
};

// Dashboard API functions
export const dashboardAPI = {
  getOverview: () => api.get('dashboard/overview'),
  getParameters: () => api.get('dashboard/parameters'),
  getCategories: () => api.get('dashboard/categories'),
  getHealth: () => api.get('dashboard/health'),
};

// Parameter API functions
export const parameterAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`parameters${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`parameters/${id}`),
  create: (data) => api.post('parameters', data),
  update: (id, data) => api.put(`parameters/${id}`, data),
  delete: (id) => api.delete(`parameters/${id}`),
  getTrendData: (id, startTime, endTime) => 
    api.get(`parameters/${id}/trend?startTime=${startTime}&endTime=${endTime}`),
};

// Alert API functions
export const alertAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`alerts${queryString ? `?${queryString}` : ''}`);
  },
  getActive: () => api.get('alerts/active'),
  acknowledge: (id) => api.put(`alerts/${id}/acknowledge`),
  resolve: (id) => api.put(`alerts/${id}/resolve`),
};

// Equipment API functions
export const equipmentAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`equipment${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`equipment/${id}`),
  create: (data) => api.post('equipment', data),
  update: (id, data) => api.put(`equipment/${id}`, data),
  delete: (id) => api.delete(`equipment/${id}`),
};

// Report API functions
export const reportAPI = {
  getTypes: () => api.get('reports/types'),
  generate: (data) => api.post('reports/generate', data),
};
