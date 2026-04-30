const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'user',
      'payment',
      'billing',
      'auth',
      'system',
      'custom'
    ),
    defaultValue: 'custom',
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  properties: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Event;