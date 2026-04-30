const AuditLog = require('../models/audit_log.model');
const { Op } = require('sequelize');

// Create audit log entry
const createAuditLog = async ({
  adminId,
  action,
  targetType,
  targetId,
  description,
  previousData,
  newData,
  ipAddress,
  status = 'success',
}) => {
  try {
    await AuditLog.create({
      adminId,
      action,
      targetType,
      targetId,
      description,
      previousData,
      newData,
      ipAddress,
      status,
    });
  } catch (err) {
    console.error('Failed to create audit log:', err.message);
  }
};

// Get all audit logs
const getAuditLogs = async (req, res) => {
  try {
    const { adminId, targetType, action, startDate, endDate, limit = 100 } = req.query;

    const where = {};
    if (adminId) where.adminId = adminId;
    if (targetType) where.targetType = targetType;
    if (action) where.action = { [Op.iLike]: `%${action}%` };
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    });

    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch audit logs',
      error: err.message,
    });
  }
};

// Get audit log by ID
const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findByPk(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    return res.status(200).json(log);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch audit log',
      error: err.message,
    });
  }
};

module.exports = { createAuditLog, getAuditLogs, getAuditLogById };