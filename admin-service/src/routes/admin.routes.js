const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getServicesHealth,
} = require('../controllers/dashboard.controller');
const {
  getAuditLogs,
  getAuditLogById,
} = require('../controllers/auditLog.controller');
const {
  getAllConfigs,
  getPublicConfigs,
  upsertConfig,
  deleteConfig,
} = require('../controllers/systemConfig.controller');
const {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deactivateAnnouncement,
} = require('../controllers/announcement.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/announcements/active', getActiveAnnouncements);
router.get('/configs/public', getPublicConfigs);

// Dashboard routes (admin only)
router.get('/dashboard', verifyToken, isAdmin, getDashboardOverview);
router.get('/dashboard/health', verifyToken, isAdmin, getServicesHealth);

// Audit log routes (admin only)
router.get('/audit-logs', verifyToken, isAdmin, getAuditLogs);
router.get('/audit-logs/:id', verifyToken, isAdmin, getAuditLogById);

// System config routes (admin only)
router.get('/configs', verifyToken, isAdmin, getAllConfigs);
router.post('/configs', verifyToken, isAdmin, upsertConfig);
router.delete('/configs/:key', verifyToken, isAdmin, deleteConfig);

// Announcement routes (admin only)
router.post('/announcements', verifyToken, isAdmin, createAnnouncement);
router.get('/announcements', verifyToken, isAdmin, getAllAnnouncements);
router.put('/announcements/:id', verifyToken, isAdmin, updateAnnouncement);
router.patch('/announcements/:id/deactivate', verifyToken, isAdmin, deactivateAnnouncement);

module.exports = router;