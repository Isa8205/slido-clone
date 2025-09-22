import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login
    console.error('Unauthorized! Redirecting to login...');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};