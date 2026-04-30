const Subscription = require('../models/subscription.model');
const BillingPlan = require('../models/billing_plan.model');

// Subscribe to a plan
const subscribe = async (req, res) => {
  try {
    const { planId, autoRenew } = req.body;
    const userId = req.user.id;

    const plan = await BillingPlan.findByPk(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: 'Billing plan not found or inactive' });
    }

    const existing = await Subscription.findOne({ where: { userId } });
    if (existing && existing.status === 'active') {
      return res.status(409).json({ message: 'User already has an active subscription' });
    }

    // Calculate end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      userId,
      planId,
      startDate,
      endDate,
      autoRenew: autoRenew ?? true,
      status: 'active',
    });

    return res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to subscribe', error: err.message });
  }
};

// Get current user subscription
const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      include: [{ model: BillingPlan }],
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    return res.status(200).json(subscription);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch subscription', error: err.message });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ where: { userId: req.user.id } });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await subscription.update({ status: 'cancelled', autoRenew: false });
    return res.status(200).json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to cancel subscription', error: err.message });
  }
};

// Admin: Get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{ model: BillingPlan }],
    });
    return res.status(200).json(subscriptions);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch subscriptions', error: err.message });
  }
};

module.exports = {
  subscribe,
  getMySubscription,
  cancelSubscription,
  getAllSubscriptions,
};