import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skillbridge-ai-internship-agent.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to allow Render free tier backend cold-start spin-up
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

// Response Interceptor: Handle API Errors & Render Server Cold Starts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Server cold start spin-up or network delay
      error.customDetail = 'Backend server is waking up on Render (free instance). Please wait 5 seconds and try again.';
    } else if (error.response.status === 401) {
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/profile')) {
        localStorage.removeItem('skillbridge_access_token');
        localStorage.removeItem('skillbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
