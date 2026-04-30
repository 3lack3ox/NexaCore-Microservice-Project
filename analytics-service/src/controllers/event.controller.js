const Event = require('../models/event.model');
const { Op } = require('sequelize');

// Track an event
const trackEvent = async (req, res) => {
  try {
    const {
      userId,
      eventType,
      category,
      source,
      properties,
      sessionId,
    } = req.body;

    const event = await Event.create({
      userId: userId || req.user?.id,
      eventType,
      category: category || 'custom',
      source,
      properties,
      sessionId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(201).json({
      message: 'Event tracked successfully',
      event,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to track event',
      error: err.message,
    });
  }
};

// Get events for current user
const getMyEvents = async (req, res) => {
  try {
    const { eventType, category, startDate, endDate, limit = 50 } = req.query;

    const where = { userId: req.user.id };

    if (eventType) where.eventType = eventType;
    if (category) where.category = category;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const events = await Event.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    });

    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch events',
      error: err.message,
    });
  }
};

// Admin: Get all events
const getAllEvents = async (req, res) => {
  try {
    const { eventType, category, userId, startDate, endDate, limit = 100 } = req.query;

    const where = {};

    if (eventType) where.eventType = eventType;
    if (category) where.category = category;
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const events = await Event.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    });

    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch events',
      error: err.message,
    });
  }
};

// Admin: Get event summary by type
const getEventSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { sequelize } = require('../models');
    const summary = await Event.findAll({
      where,
      attributes: [
        'eventType',
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['eventType', 'category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch event summary',
      error: err.message,
    });
  }
};

module.exports = {
  trackEvent,
  getMyEvents,
  getAllEvents,
  getEventSummary,
};