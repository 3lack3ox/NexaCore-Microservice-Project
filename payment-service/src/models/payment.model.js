const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd',
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'succeeded',
      'failed',
      'refunded',
      'cancelled'
    ),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Payment;