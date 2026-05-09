const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripePaymentMethodId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiryMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expiryYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = PaymentMethod;