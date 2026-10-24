import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce-1-gold.vercel.app', // <--- حطي اللينك ده
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;