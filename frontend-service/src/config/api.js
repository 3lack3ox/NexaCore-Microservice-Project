import axios from 'axios';

// Base API clients using relative paths
// Nginx on Kubernetes handles proxying to the correct backend service
const createClient = (basePath) => {
  const client = axios.create({ baseURL: basePath });

  // Attach token to every request
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('nexacore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 globally
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('nexacore_token');
        localStorage.removeItem('nexacore_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// All paths are relative - Nginx proxies them to the correct backend service
export const authAPI         = createClient('/api/auth');
export const userAPI         = createClient('/api/users');
export const billingAPI      = createClient('/api/billing');
export const paymentsAPI     = createClient('/api/payments');
export const notificationsAPI = createClient('/api/notifications');
export const analyticsAPI    = createClient('/api/analytics');
export const adminAPI        = createClient('/api/admin');