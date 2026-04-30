const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const BillingPlan = sequelize.define('BillingPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    defaultValue: 'monthly',
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = BillingPlan;