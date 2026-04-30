import axios from 'axios';

// Base API clients for each service
const createClient = (baseURL) => {
  const client = axios.create({ baseURL });

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

export const authAPI = createClient(process.env.REACT_APP_AUTH_SERVICE_URL);
export const userAPI = createClient(process.env.REACT_APP_USER_SERVICE_URL);
export const billingAPI = createClient(process.env.REACT_APP_BILLING_SERVICE_URL);
export const paymentsAPI = createClient(process.env.REACT_APP_PAYMENTS_SERVICE_URL);
export const notificationsAPI = createClient(process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL);
export const analyticsAPI = createClient(process.env.REACT_APP_ANALYTICS_SERVICE_URL);
export const adminAPI = createClient(process.env.REACT_APP_ADMIN_SERVICE_URL);