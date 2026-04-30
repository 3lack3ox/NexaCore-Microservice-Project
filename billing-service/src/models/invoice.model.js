const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Invoice;