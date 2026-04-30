const axios = require('axios');

// Service clients for inter-service communication
const authClient = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 5000,
});

const userClient = axios.create({
  baseURL: process.env.USER_SERVICE_URL,
  timeout: 5000,
});

const billingClient = axios.create({
  baseURL: process.env.BILLING_SERVICE_URL,
  timeout: 5000,
});

const paymentsClient = axios.create({
  baseURL: process.env.PAYMENTS_SERVICE_URL,
  timeout: 5000,
});

const notificationsClient = axios.create({
  baseURL: process.env.NOTIFICATIONS_SERVICE_URL,
  timeout: 5000,
});

const analyticsClient = axios.create({
  baseURL: process.env.ANALYTICS_SERVICE_URL,
  timeout: 5000,
});

// Helper to forward auth token to other services
const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

module.exports = {
  authClient,
  userClient,
  billingClient,
  paymentsClient,
  notificationsClient,
  analyticsClient,
  withAuth,
};