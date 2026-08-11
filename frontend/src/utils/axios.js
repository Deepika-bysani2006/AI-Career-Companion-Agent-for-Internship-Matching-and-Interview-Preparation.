import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skillbridge-ai-internship-agent.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout to allow Render free instance cold starts
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle API Errors & Expired Session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or backend cold start spin-up timeout
      console.warn('Network error or backend cold start spin-up in progress...');
    } else if (error.response.status === 401) {
      // Unauthenticated session cleanup
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/profile')) {
        localStorage.removeItem('skillbridge_access_token');
        localStorage.removeItem('skillbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
