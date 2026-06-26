import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, password) =>
    api.post('/auth/register', { username, password }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

export const detectionsAPI = {
  detect: (formData) =>
    api.post('/detections/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/detections'),
  getOne: (id) => api.get(`/detections/${id}`),
  update: (id, data) => api.put(`/detections/${id}`, data),
  delete: (id) => api.delete(`/detections/${id}`),
  getTrending: () => api.get('/detections/trending'),
  getActiveDashboardItems: () => api.get('/dashboard-items/active'),
  getStats: () => api.get('/detections/stats'),
};

export const newsAPI = {
  getTrustedNews: () => api.get('/news/trusted'),
};

export const adminAPI = {
  // Stats
  getStats: () => api.get('/admin/stats'),
  
  // Users
  getUsers: (page = 1, limit = 20) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  getUser: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Detections
  getDetections: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/admin/detections?${params.toString()}`);
  },
  getDetection: (id) => api.get(`/admin/detections/${id}`),
  updateDetection: (id, data) => api.patch(`/admin/detections/${id}`, data),
  deleteDetection: (id) => api.delete(`/admin/detections/${id}`),
  
  // Dashboard Items
  getDashboardItems: (activeOnly = false) => api.get(`/admin/dashboard-items?activeOnly=${activeOnly}`),
  getDashboardItem: (id) => api.get(`/admin/dashboard-items/${id}`),
  createDashboardItem: (data) => api.post('/admin/dashboard-items', data),
  updateDashboardItem: (id, data) => api.patch(`/admin/dashboard-items/${id}`, data),
  deleteDashboardItem: (id) => api.delete(`/admin/dashboard-items/${id}`),
  
  // Audit Logs
  getAuditLogs: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/admin/audit-logs?${params.toString()}`);
  },
};

export default api;

