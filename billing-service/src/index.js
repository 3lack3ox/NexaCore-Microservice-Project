require('dotenv').config();
const express = require('express');
const billingRoutes = require('./routes/billing.routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Billing Service is running' });
});

// Routes
app.use('/api/billing', billingRoutes);

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Billing Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });