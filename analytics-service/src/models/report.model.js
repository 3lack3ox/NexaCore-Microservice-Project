const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'user_growth',
      'revenue',
      'payment_summary',
      'event_summary',
      'custom'
    ),
    allowNull: false,
  },
  generatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = Report;