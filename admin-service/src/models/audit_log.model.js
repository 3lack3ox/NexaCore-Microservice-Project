const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetType: {
    type: DataTypes.ENUM(
      'user',
      'billing',
      'payment',
      'notification',
      'system',
      'report'
    ),
    allowNull: false,
  },
  targetId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  previousData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  newData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('success', 'failed'),
    defaultValue: 'success',
  },
}, {
  timestamps: true,
});

module.exports = AuditLog;