const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Metric = sequelize.define('Metric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM(
      'revenue',
      'users',
      'payments',
      'performance',
      'custom'
    ),
    defaultValue: 'custom',
  },
  period: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    defaultValue: 'daily',
  },
  periodDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Metric;