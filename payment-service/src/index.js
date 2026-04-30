require('dotenv').config();
const express = require('express');
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3004;

// Stripe webhooks require raw body, so we set it up before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Payments Service is running' });
});

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/payments', webhookRoutes);

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Payments Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });