import axios from 'axios';
import type { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string): Promise<ApiResponse<T>> => api.get(url).then(res => res.data),
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> => api.post(url, data).then(res => res.data),
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> => api.put(url, data).then(res => res.data),
  delete: <T>(url: string): Promise<ApiResponse<T>> => api.delete(url).then(res => res.data),
};

export default api;
