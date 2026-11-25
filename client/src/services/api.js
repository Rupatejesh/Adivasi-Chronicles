import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'ac_auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback;
}

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  updateMe: (payload) => api.put('/auth/me', payload).then((res) => res.data),
};

export const categoriesApi = {
  list: (params) => api.get('/categories', { params }).then((res) => res.data),
  create: (payload) => api.post('/categories', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/categories/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/categories/${id}`).then((res) => res.data),
};

export const postsApi = {
  list: (params) => api.get('/posts', { params }).then((res) => res.data),
  search: (q) => api.get('/posts/search', { params: { q } }).then((res) => res.data),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`).then((res) => res.data),
  getById: (id) => api.get(`/posts/${id}`).then((res) => res.data),
  getByAuthor: (userId) => api.get(`/posts/author/${userId}`).then((res) => res.data),
  create: (payload) => api.post('/posts', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/posts/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/posts/${id}`).then((res) => res.data),
  toggleLike: (id) => api.post(`/posts/${id}/like`).then((res) => res.data),
};

export const commentsApi = {
  listByPost: (postId) => api.get(`/comments/post/${postId}`).then((res) => res.data),
  create: (payload) => api.post('/comments', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/comments/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/comments/${id}`).then((res) => res.data),
  adminListAll: () => api.get('/comments/admin/all').then((res) => res.data),
  moderate: (id, isActive) => api.patch(`/comments/${id}/moderate`, { isActive }).then((res) => res.data),
};

export const biographiesApi = {
  list: (params) => api.get('/biographies', { params }).then((res) => res.data),
  getBySlug: (slug) => api.get(`/biographies/slug/${slug}`).then((res) => res.data),
  create: (payload) => api.post('/biographies', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/biographies/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/biographies/${id}`).then((res) => res.data),
};

export const booksApi = {
  list: (params) => api.get('/books', { params }).then((res) => res.data),
  getBySlug: (slug) => api.get(`/books/slug/${slug}`).then((res) => res.data),
  create: (payload) => api.post('/books', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/books/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/books/${id}`).then((res) => res.data),
};

export const knowledgeApi = {
  list: (params) => api.get('/knowledge', { params }).then((res) => res.data),
  getBySlug: (slug, section) => api.get(`/knowledge/slug/${slug}`, { params: section ? { section } : undefined }).then((res) => res.data),
  create: (payload) => api.post('/knowledge', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/knowledge/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/knowledge/${id}`).then((res) => res.data),
};

export const schemesApi = {
  list: (params) => api.get('/schemes', { params }).then((res) => res.data),
  getBySlug: (slug) => api.get(`/schemes/slug/${slug}`).then((res) => res.data),
  create: (payload) => api.post('/schemes', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/schemes/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/schemes/${id}`).then((res) => res.data),
};

export const songsApi = {
  list: (params) => api.get('/songs', { params }).then((res) => res.data),
  create: (payload) => api.post('/songs', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/songs/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/songs/${id}`).then((res) => res.data),
};

export const galleryApi = {
  list: (params) => api.get('/gallery', { params }).then((res) => res.data),
  create: (payload) => api.post('/gallery', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/gallery/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/gallery/${id}`).then((res) => res.data),
};

export const journeyApi = {
  list: (params) => api.get('/journey', { params }).then((res) => res.data),
  create: (payload) => api.post('/journey', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/journey/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/journey/${id}`).then((res) => res.data),
};

export const favouritesApi = {
  list: (params) => api.get('/favourites', { params }).then((res) => res.data),
  toggle: (itemType, itemId) => api.post('/favourites/toggle', { itemType, itemId }).then((res) => res.data),
};

export const contactApi = {
  submit: (payload) => api.post('/contact', payload).then((res) => res.data),
  list: () => api.get('/contact').then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/contact/${id}`, { status }).then((res) => res.data),
  remove: (id) => api.delete(`/contact/${id}`).then((res) => res.data),
};

export const searchApi = {
  search: (q) => api.get('/search', { params: { q } }).then((res) => res.data),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats').then((res) => res.data),
  listUsers: () => api.get('/admin/users').then((res) => res.data),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload).then((res) => res.data),
};

export default api;
