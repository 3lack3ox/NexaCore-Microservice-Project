const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'critical', 'maintenance'),
    defaultValue: 'info',
  },
  targetAudience: {
    type: DataTypes.ENUM('all', 'admins', 'users'),
    defaultValue: 'all',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Announcement;