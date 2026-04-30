const SystemConfig = require('../models/system_config.model');
const { createAuditLog } = require('./auditLog.controller');

// Get all system configs
const getAllConfigs = async (req, res) => {
  try {
    const configs = await SystemConfig.findAll();
    return res.status(200).json(configs);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch configs',
      error: err.message,
    });
  }
};

// Get public configs (accessible without admin)
const getPublicConfigs = async (req, res) => {
  try {
    const configs = await SystemConfig.findAll({
      where: { isPublic: true },
      attributes: ['key', 'value', 'description'],
    });
    return res.status(200).json(configs);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch public configs',
      error: err.message,
    });
  }
};

// Create or update a system config
const upsertConfig = async (req, res) => {
  try {
    const { key, value, description, isPublic } = req.body;

    const existing = await SystemConfig.findOne({ where: { key } });
    const previousData = existing ? existing.toJSON() : null;

    const [config, created] = await SystemConfig.upsert({
      key,
      value,
      description,
      isPublic: isPublic ?? false,
      updatedBy: req.user.id,
    });

    await createAuditLog({
      adminId: req.user.id,
      action: created ? 'CREATE_CONFIG' : 'UPDATE_CONFIG',
      targetType: 'system',
      targetId: key,
      description: `Config key "${key}" ${created ? 'created' : 'updated'}`,
      previousData,
      newData: config.toJSON(),
      ipAddress: req.ip,
    });

    return res.status(200).json({
      message: `Config ${created ? 'created' : 'updated'} successfully`,
      config,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to upsert config',
      error: err.message,
    });
  }
};

// Delete a system config
const deleteConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne({
      where: { key: req.params.key },
    });

    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    await createAuditLog({
      adminId: req.user.id,
      action: 'DELETE_CONFIG',
      targetType: 'system',
      targetId: req.params.key,
      description: `Config key "${req.params.key}" deleted`,
      previousData: config.toJSON(),
      ipAddress: req.ip,
    });

    await config.destroy();
    return res.status(200).json({ message: 'Config deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to delete config',
      error: err.message,
    });
  }
};

module.exports = {
  getAllConfigs,
  getPublicConfigs,
  upsertConfig,
  deleteConfig,
};