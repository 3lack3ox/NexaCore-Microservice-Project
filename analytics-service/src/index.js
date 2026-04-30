require('dotenv').config();
const express = require('express');
const analyticsRoutes = require('./routes/analytics.routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Analytics Service is running' });
});

// Routes
app.use('/api/analytics', analyticsRoutes);

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Analytics Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });