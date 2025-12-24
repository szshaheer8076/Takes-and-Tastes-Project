// src/services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../utils/constants';

console.log('[API] Initializing with base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    console.log('[API Request]', config.method.toUpperCase(), config.url);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('[API] SecureStore not available (web), skipping token');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('[API Response Error]', error.response?.status, error.message);
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => {
    console.log('[authAPI] Registering user:', userData.email);
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('[authAPI] Logging in:', credentials.email);
    return api.post('/auth/login', credentials);
  },
  getProfile: () => {
    console.log('[authAPI] Getting profile');
    return api.get('/auth/me');
  },
  updateProfile: (userData) => {
    console.log('[authAPI] Updating profile');
    return api.put('/auth/profile', userData);
  },
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params) => {
    console.log('[restaurantAPI] Getting all restaurants', params);
    return api.get('/restaurants', { params });
  },
  getById: (id) => {
    console.log('[restaurantAPI] Getting restaurant:', id);
    return api.get(`/restaurants/${id}`);
  },
  getMenu: (id, params) => {
    console.log('[restaurantAPI] Getting menu for:', id, params);
    return api.get(`/restaurants/${id}/menu`, { params });
  },
  getCategories: () => {
    console.log('[restaurantAPI] Getting categories');
    return api.get('/restaurants/categories/all');
  },
};

// Order APIs
export const orderAPI = {
  create: (orderData) => {
    console.log('[orderAPI] Creating order');
    return api.post('/orders', orderData);
  },
  getUserOrders: () => {
    console.log('[orderAPI] Getting user orders');
    return api.get('/orders');
  },
  getById: (id) => {
    console.log('[orderAPI] Getting order:', id);
    return api.get(`/orders/${id}`);
  },
};

export default api;