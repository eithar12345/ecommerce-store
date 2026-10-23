import axios from 'axios';

const api = axios.create({
  // Vercel هيقرأ المتغير VITE_API_URL اللي إحنا حاطينه في الإعدادات
  // ولو شغال على جهازك، هيستخدم localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;