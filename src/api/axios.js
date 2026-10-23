import axios from 'axios';

const api = axios.create({
  // في Vercel، المتغير BACKEND_URL هيتولد أوتوماتيك عشان يربط الفرونت بالباك إند
  // في جهازك المحلي (Localhost)، هيستخدم البورت 3000
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;