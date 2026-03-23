import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── ✅ Attach JWT token to every request ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mkcc_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── ✅ Handle response errors ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mkcc_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;