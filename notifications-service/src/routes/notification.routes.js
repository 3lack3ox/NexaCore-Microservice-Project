const express = require('express');
const router = express.Router();
const {
  sendInAppNotification,
  sendEmailNotification,
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAllNotifications,
} = require('../controllers/notification.controller');
const {
  getPreferences,
  updatePreferences,
} = require('../controllers/preference.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// User notification routes
router.get('/', verifyToken, getMyNotifications);
router.get('/unread', verifyToken, getUnreadNotifications);
router.patch('/:id/read', verifyToken, markAsRead);
router.patch('/read-all', verifyToken, markAllAsRead);
router.delete('/:id', verifyToken, deleteNotification);

// Notification preference routes
router.get('/preferences', verifyToken, getPreferences);
router.put('/preferences', verifyToken, updatePreferences);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, getAllNotifications);
router.post('/send/inapp', verifyToken, isAdmin, sendInAppNotification);
router.post('/send/email', verifyToken, isAdmin, sendEmailNotification);

module.exports = router;