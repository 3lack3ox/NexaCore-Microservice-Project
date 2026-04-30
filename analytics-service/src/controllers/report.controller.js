const Report = require('../models/report.model');
const Event = require('../models/event.model');
const Metric = require('../models/metric.model');
const { Op } = require('sequelize');

// Generate a report
const generateReport = async (req, res) => {
  try {
    const { name, type, startDate, endDate } = req.body;
    const generatedBy = req.user.id;

    // Create report record
    const report = await Report.create({
      name,
      type,
      generatedBy,
      startDate,
      endDate,
      status: 'pending',
    });

    // Build report data based on type
    let data = {};
    const dateFilter = {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    switch (type) {
      case 'event_summary': {
        const events = await Event.findAll({ where: dateFilter });
        const grouped = events.reduce((acc, event) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1;
          return acc;
        }, {});
        data = { totalEvents: events.length, byType: grouped };
        break;
      }

      case 'revenue': {
        const metrics = await Metric.findAll({
          where: { category: 'revenue', periodDate: { [Op.between]: [startDate, endDate] } },
        });
        const total = metrics.reduce((sum, m) => sum + parseFloat(m.value), 0);
        data = { totalRevenue: total, breakdown: metrics };
        break;
      }

      case 'user_growth': {
        const metrics = await Metric.findAll({
          where: { category: 'users', periodDate: { [Op.between]: [startDate, endDate] } },
        });
        const total = metrics.reduce((sum, m) => sum + parseFloat(m.value), 0);
        data = { totalNewUsers: total, breakdown: metrics };
        break;
      }

      case 'payment_summary': {
        const metrics = await Metric.findAll({
          where: { category: 'payments', periodDate: { [Op.between]: [startDate, endDate] } },
        });
        data = { totalPayments: metrics.length, breakdown: metrics };
        break;
      }

      default: {
        data = { message: 'Custom report - no automated data collection' };
      }
    }

    // Update report with data
    await report.update({ data, status: 'completed' });

    return res.status(201).json({
      message: 'Report generated successfully',
      report: { ...report.toJSON(), data },
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to generate report',
      error: err.message,
    });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(reports);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch reports',
      error: err.message,
    });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    return res.status(200).json(report);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch report',
      error: err.message,
    });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.destroy();
    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to delete report',
      error: err.message,
    });
  }
};

module.exports = {
  generateReport,
  getAllReports,
  getReportById,
  deleteReport,
};