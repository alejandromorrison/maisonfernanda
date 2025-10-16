import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
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

// Auth API
export const auth = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const products = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  autocomplete: (q: string) => api.get('/products/autocomplete', { params: { q } }),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cart = {
  sync: (items: any[]) => api.post('/cart/sync', { items }),
  get: () => api.get('/cart'),
};

// Checkout API
export const checkout = {
  createSession: (data: any) => api.post('/checkout/create-session', data),
};

// Orders API
export const orders = {
  getAll: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  getAllAdmin: () => api.get('/orders/admin/all'),
  updateStatus: (id: string, status: string) => 
    api.put(`/orders/${id}/status`, { status }),
};

export default api;

