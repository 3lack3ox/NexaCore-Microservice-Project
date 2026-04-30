const BillingPlan = require('../models/billing_plan.model');

// Admin: Create a billing plan
const createPlan = async (req, res) => {
  try {
    const { name, price, currency, billingCycle, features } = req.body;

    const existing = await BillingPlan.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: 'Plan with this name already exists' });
    }

    const plan = await BillingPlan.create({
      name,
      price,
      currency: currency || 'USD',
      billingCycle,
      features,
    });

    return res.status(201).json({ message: 'Billing plan created', plan });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create plan', error: err.message });
  }
};

// Get all active plans (public)
const getPlans = async (req, res) => {
  try {
    const plans = await BillingPlan.findAll({ where: { isActive: true } });
    return res.status(200).json(plans);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch plans', error: err.message });
  }
};

// Admin: Update a plan
const updatePlan = async (req, res) => {
  try {
    const plan = await BillingPlan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await plan.update(req.body);
    return res.status(200).json({ message: 'Plan updated successfully', plan });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update plan', error: err.message });
  }
};

// Admin: Deactivate a plan
const deactivatePlan = async (req, res) => {
  try {
    const plan = await BillingPlan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await plan.update({ isActive: false });
    return res.status(200).json({ message: 'Plan deactivated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to deactivate plan', error: err.message });
  }
};

module.exports = { createPlan, getPlans, updatePlan, deactivatePlan };