const axios = require('axios');
const {
  authClient,
  userClient,
  billingClient,
  paymentsClient,
  analyticsClient,
  withAuth,
} = require('../config/serviceClients');

// Get platform overview dashboard
const getDashboardOverview = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  try {
    // Fetch data from all services in parallel
    const [users, invoices, payments, events] = await Promise.allSettled([
      userClient.get('/api/users', withAuth(token)),
      billingClient.get('/api/billing/admin/invoices', withAuth(token)),
      paymentsClient.get('/api/payments/admin/all', withAuth(token)),
      analyticsClient.get('/api/analytics/events', withAuth(token)),
    ]);

    const overview = {
      totalUsers: users.status === 'fulfilled'
        ? users.value.data.length : 0,
      totalInvoices: invoices.status === 'fulfilled'
        ? invoices.value.data.length : 0,
      totalPayments: payments.status === 'fulfilled'
        ? payments.value.data.length : 0,
      totalEvents: events.status === 'fulfilled'
        ? events.value.data.length : 0,
      revenue: payments.status === 'fulfilled'
        ? payments.value.data
            .filter((p) => p.status === 'succeeded')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0)
        : 0,
    };

    return res.status(200).json({
      message: 'Dashboard overview fetched successfully',
      overview,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch dashboard overview',
      error: err.message,
    });
  }
};

// Get service health status
const getServicesHealth = async (req, res) => {
  try {
    const services = [
      { name: 'auth-service', client: authClient },
      { name: 'user-service', client: userClient },
      { name: 'billing-service', client: billingClient },
      { name: 'payments-service', client: paymentsClient },
    ];

    const healthChecks = await Promise.allSettled(
      services.map((s) => s.client.get('/health'))
    );

    const statuses = services.map((s, i) => ({
      service: s.name,
      status: healthChecks[i].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      message:
        healthChecks[i].status === 'fulfilled'
          ? healthChecks[i].value.data.status
          : healthChecks[i].reason?.message || 'Unreachable',
    }));

    return res.status(200).json({ services: statuses });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch service health',
      error: err.message,
    });
  }
};

module.exports = { getDashboardOverview, getServicesHealth };