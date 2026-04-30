const NotificationPreference = require('../models/notification_preference.model');

// Get notification preferences
const getPreferences = async (req, res) => {
  try {
    let preference = await NotificationPreference.findOne({
      where: { userId: req.user.id },
    });

    // Create default preferences if none exist
    if (!preference) {
      preference = await NotificationPreference.create({ userId: req.user.id });
    }

    return res.status(200).json(preference);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch preferences',
      error: err.message,
    });
  }
};

// Update notification preferences
const updatePreferences = async (req, res) => {
  try {
    const {
      emailEnabled,
      inAppEnabled,
      smsEnabled,
      marketingEnabled,
      securityAlertsEnabled,
      billingAlertsEnabled,
    } = req.body;

    let preference = await NotificationPreference.findOne({
      where: { userId: req.user.id },
    });

    if (!preference) {
      preference = await NotificationPreference.create({ userId: req.user.id });
    }

    await preference.update({
      emailEnabled,
      inAppEnabled,
      smsEnabled,
      marketingEnabled,
      securityAlertsEnabled,
      billingAlertsEnabled,
    });

    return res.status(200).json({
      message: 'Preferences updated successfully',
      preference,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to update preferences',
      error: err.message,
    });
  }
};

module.exports = { getPreferences, updatePreferences };