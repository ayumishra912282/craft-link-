import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('craftlink_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export const productApi = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get('/products/' + id),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put('/products/' + id, data),
  deleteProduct: (id) => api.delete('/products/' + id),
  sendInquiry: (id, data) => api.post('/products/' + id + '/inquire', data),
};

export const aiApi = {
  analyzeProduct: (formData) => api.post('/ai/analyze-product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateCatalog: (data) => api.post('/ai/generate-catalog', data),
  regenerateCatalog: (data) => api.post('/ai/regenerate-catalog', data),
  uploadImage: (formData) => api.post('/ai/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const searchApi = {
  semanticSearch: (data) => api.post('/search/semantic', data),
};

export const recommendationApi = {
  getRecommendations: (productId) => api.get('/recommendations', { params: { product_id: productId } }),
};

export const artisanApi = {
  getStats: (artisanId) => api.get('/artisan/stats/' + artisanId),
  getProfile: (artisanId) => api.get('/artisan/profile/' + artisanId),
  updateProfile: (artisanId, data) => api.put('/artisan/profile/' + artisanId, data),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: (role) => api.post('/auth/demo-login/' + role),
  getMe: () => api.get('/auth/me'),
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
};

export const metaApi = {
  getCategories: () => api.get('/metadata/categories'),
  getCrafts: () => api.get('/metadata/crafts'),
  getRegions: () => api.get('/metadata/regions'),
  resetDemoData: () => api.post('/metadata/seed-reset'),
  getHealth: () => api.get('/health'),
};

export default api;
