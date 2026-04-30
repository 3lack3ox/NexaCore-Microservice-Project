require('dotenv').config();
const express = require('express');
const notificationRoutes = require('./routes/notification.routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Notifications Service is running' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Notifications Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });