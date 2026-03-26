import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Goals API
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Health API
export const healthAPI = {
  getAll: (params) => api.get('/health', { params }),
  create: (data) => api.post('/health', data),
  getInsights: () => api.get('/health/insights'),
};

// Finance API
export const financeAPI = {
  getAll: (params) => api.get('/finance', { params }),
  create: (data) => api.post('/finance', data),
  update: (id, data) => api.put(`/finance/${id}`, data),
  delete: (id) => api.delete(`/finance/${id}`),
  getSummary: () => api.get('/finance/summary'),
};

// Relationships API
export const relationshipsAPI = {
  getAll: () => api.get('/relationships'),
  create: (data) => api.post('/relationships', data),
  update: (id, data) => api.put(`/relationships/${id}`, data),
  delete: (id) => api.delete(`/relationships/${id}`),
  addInteraction: (id, data) => api.post(`/relationships/${id}/interactions`, data),
  getUpcoming: () => api.get('/relationships/upcoming'),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`),
};

// Insights API
export const insightsAPI = {
  getAll: () => api.get('/insights'),
};

export default api;