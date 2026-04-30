const Metric = require('../models/metric.model');
const { Op } = require('sequelize');

// Record a metric
const recordMetric = async (req, res) => {
  try {
    const { name, value, unit, category, period, periodDate, metadata } = req.body;

    const metric = await Metric.create({
      name,
      value,
      unit,
      category: category || 'custom',
      period: period || 'daily',
      periodDate,
      metadata,
    });

    return res.status(201).json({
      message: 'Metric recorded successfully',
      metric,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to record metric',
      error: err.message,
    });
  }
};

// Get metrics by category and period
const getMetrics = async (req, res) => {
  try {
    const { category, period, startDate, endDate, name } = req.query;

    const where = {};
    if (category) where.category = category;
    if (period) where.period = period;
    if (name) where.name = name;
    if (startDate && endDate) {
      where.periodDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const metrics = await Metric.findAll({
      where,
      order: [['periodDate', 'DESC']],
    });

    return res.status(200).json(metrics);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch metrics',
      error: err.message,
    });
  }
};

// Get revenue metrics summary
const getRevenueSummary = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { sequelize } = require('../models');

    const summary = await Metric.findAll({
      where: {
        category: 'revenue',
        period,
      },
      attributes: [
        'periodDate',
        [sequelize.fn('SUM', sequelize.col('value')), 'totalRevenue'],
      ],
      group: ['periodDate'],
      order: [['periodDate', 'ASC']],
    });

    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch revenue summary',
      error: err.message,
    });
  }
};

// Get user growth metrics
const getUserGrowth = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { sequelize } = require('../models');

    const growth = await Metric.findAll({
      where: {
        category: 'users',
        period,
      },
      attributes: [
        'periodDate',
        [sequelize.fn('SUM', sequelize.col('value')), 'totalUsers'],
      ],
      group: ['periodDate'],
      order: [['periodDate', 'ASC']],
    });

    return res.status(200).json(growth);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch user growth',
      error: err.message,
    });
  }
};

module.exports = {
  recordMetric,
  getMetrics,
  getRevenueSummary,
  getUserGrowth,
};