import axios from 'axios';

// Determine API URL based on environment
const API_URL = (() => {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In production (Vercel environment), use the specific backend deployment
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://maison-fernanda-backend-4xcvs3hgb-alejandros-projects-ebed6ed9.vercel.app';
  }

  // Default for development
  return 'http://localhost:5000';
})();

// Ensure API_URL doesn't end with slash to avoid double slashes
const cleanAPIUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

const api = axios.create({
  baseURL: `${cleanAPIUrl}/api`,
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

// Site Content API
export const siteContent = {
  get: () => api.get('/site-content'),
  update: (data: any) => api.put('/site-content', data),
  updateHero: (data: any) => api.put('/site-content/hero', data),
  updateEditorial: (data: any) => api.put('/site-content/editorial', data),
  updateCategories: (data: any) => api.put('/site-content/categories', data),
  updateFooter: (data: any) => api.put('/site-content/footer', data),
};

// Newsletter API
export const newsletter = {
  subscribe: (data: any) => api.post('/newsletter/subscribe', data),
  unsubscribe: (data: any) => api.post('/newsletter/unsubscribe', data),
  getSubscribers: (params?: any) => api.get('/newsletter/subscribers', { params }),
  getStats: () => api.get('/newsletter/stats'),
  updateSubscriber: (id: string, data: any) => api.put(`/newsletter/subscriber/${id}`, data),
  deleteSubscriber: (id: string) => api.delete(`/newsletter/subscriber/${id}`),
};

// Page Content API
export const pages = {
  getAll: () => api.get('/pages'),
  getBySlug: (slug: string) => api.get(`/pages/${slug}`),
  getAllAdmin: () => api.get('/pages/admin/all'),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.put(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
  toggle: (id: string) => api.put(`/pages/${id}/toggle`),
};

export default api;

