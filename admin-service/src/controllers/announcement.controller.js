const Announcement = require('../models/announcement.model');
const { createAuditLog } = require('./auditLog.controller');
const { Op } = require('sequelize');

// Create announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, targetAudience, expiresAt } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'info',
      targetAudience: targetAudience || 'all',
      publishedAt: new Date(),
      expiresAt,
      createdBy: req.user.id,
      isActive: true,
    });

    await createAuditLog({
      adminId: req.user.id,
      action: 'CREATE_ANNOUNCEMENT',
      targetType: 'system',
      targetId: announcement.id,
      description: `Announcement "${title}" created`,
      newData: announcement.toJSON(),
      ipAddress: req.ip,
    });

    return res.status(201).json({
      message: 'Announcement created successfully',
      announcement,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to create announcement',
      error: err.message,
    });
  }
};

// Get all active announcements (public)
const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: now } },
        ],
      },
      order: [['publishedAt', 'DESC']],
    });
    return res.status(200).json(announcements);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch announcements',
      error: err.message,
    });
  }
};

// Get all announcements (admin)
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(announcements);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch announcements',
      error: err.message,
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const previousData = announcement.toJSON();
    await announcement.update(req.body);

    await createAuditLog({
      adminId: req.user.id,
      action: 'UPDATE_ANNOUNCEMENT',
      targetType: 'system',
      targetId: announcement.id,
      description: `Announcement "${announcement.title}" updated`,
      previousData,
      newData: announcement.toJSON(),
      ipAddress: req.ip,
    });

    return res.status(200).json({
      message: 'Announcement updated successfully',
      announcement,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to update announcement',
      error: err.message,
    });
  }
};

// Deactivate announcement
const deactivateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.update({ isActive: false });

    await createAuditLog({
      adminId: req.user.id,
      action: 'DEACTIVATE_ANNOUNCEMENT',
      targetType: 'system',
      targetId: announcement.id,
      description: `Announcement "${announcement.title}" deactivated`,
      ipAddress: req.ip,
    });

    return res.status(200).json({ message: 'Announcement deactivated successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to deactivate announcement',
      error: err.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deactivateAnnouncement,
};