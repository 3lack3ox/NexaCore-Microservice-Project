const Notification = require('../models/notification.model');
const { sendEmail } = require('../config/mailer');
const templates = require('../config/templates');

// Send in-app notification
const sendInAppNotification = async (req, res) => {
  try {
    const { userId, title, message, metadata } = req.body;

    const notification = await Notification.create({
      userId,
      type: 'in_app',
      title,
      message,
      metadata,
      status: 'unread',
    });

    return res.status(201).json({
      message: 'In-app notification sent successfully',
      notification,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to send notification',
      error: err.message,
    });
  }
};

// Send email notification
const sendEmailNotification = async (req, res) => {
  try {
    const { userId, email, templateName, templateData, title } = req.body;

    // Get template
    const template = templates[templateName];
    if (!template) {
      return res.status(400).json({ message: 'Invalid template name' });
    }

    const { subject, html } = template(...(templateData || []));

    // Send email
    const result = await sendEmail({ to: email, subject, html });

    // Record notification
    const notification = await Notification.create({
      userId,
      type: 'email',
      title: title || subject,
      message: `Email sent to ${email}`,
      status: result.success ? 'sent' : 'failed',
      metadata: { email, templateName, ...templateData },
    });

    if (!result.success) {
      return res.status(500).json({
        message: 'Email delivery failed',
        notification,
      });
    }

    return res.status(201).json({
      message: 'Email notification sent successfully',
      notification,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to send email notification',
      error: err.message,
    });
  }
};

// Get all notifications for current user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch notifications',
      error: err.message,
    });
  }
};

// Get unread notifications for current user
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id, isRead: false },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch unread notifications',
      error: err.message,
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({
      isRead: true,
      status: 'read',
      readAt: new Date(),
    });

    return res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to mark notification as read',
      error: err.message,
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true, status: 'read', readAt: new Date() },
      { where: { userId: req.user.id, isRead: false } }
    );

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to mark all as read',
      error: err.message,
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to delete notification',
      error: err.message,
    });
  }
};

// Admin: Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch all notifications',
      error: err.message,
    });
  }
};

module.exports = {
  sendInAppNotification,
  sendEmailNotification,
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAllNotifications,
};