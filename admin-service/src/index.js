require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/admin.routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Admin Service is running' });
});

// Routes
app.use('/api/admin', adminRoutes);

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admin Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });