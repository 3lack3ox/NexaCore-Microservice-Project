const express = require('express');
const router = express.Router();
const {
  trackEvent,
  getMyEvents,
  getAllEvents,
  getEventSummary,
} = require('../controllers/event.controller');
const {
  recordMetric,
  getMetrics,
  getRevenueSummary,
  getUserGrowth,
} = require('../controllers/metric.controller');
const {
  generateReport,
  getAllReports,
  getReportById,
  deleteReport,
} = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Event routes (user)
router.post('/events', verifyToken, trackEvent);
router.get('/events/me', verifyToken, getMyEvents);

// Event routes (admin)
router.get('/events', verifyToken, isAdmin, getAllEvents);
router.get('/events/summary', verifyToken, isAdmin, getEventSummary);

// Metric routes (admin)
router.post('/metrics', verifyToken, isAdmin, recordMetric);
router.get('/metrics', verifyToken, isAdmin, getMetrics);
router.get('/metrics/revenue', verifyToken, isAdmin, getRevenueSummary);
router.get('/metrics/users', verifyToken, isAdmin, getUserGrowth);

// Report routes (admin)
router.post('/reports', verifyToken, isAdmin, generateReport);
router.get('/reports', verifyToken, isAdmin, getAllReports);
router.get('/reports/:id', verifyToken, isAdmin, getReportById);
router.delete('/reports/:id', verifyToken, isAdmin, deleteReport);

module.exports = router;