const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const NotificationPreference = sequelize.define('NotificationPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  emailEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  inAppEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  smsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  marketingEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  securityAlertsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  billingAlertsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = NotificationPreference;