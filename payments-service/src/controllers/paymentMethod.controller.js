const stripe = require('../config/stripe');
const PaymentMethod = require('../models/payment_method.model');

// Add a payment method
const addPaymentMethod = async (req, res) => {
  try {
    const { stripePaymentMethodId } = req.body;
    const userId = req.user.id;

    // Create or retrieve Stripe customer
    let stripeCustomerId;
    const existing = await PaymentMethod.findOne({ where: { userId } });

    if (existing) {
      stripeCustomerId = existing.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(stripePaymentMethodId, {
      customer: stripeCustomerId,
    });

    // Retrieve payment method details
    const pm = await stripe.paymentMethods.retrieve(stripePaymentMethodId);

    const paymentMethod = await PaymentMethod.create({
      userId,
      stripeCustomerId,
      stripePaymentMethodId,
      type: pm.type,
      last4: pm.card?.last4,
      brand: pm.card?.brand,
      expiryMonth: pm.card?.exp_month,
      expiryYear: pm.card?.exp_year,
      isDefault: !existing,
    });

    return res.status(201).json({
      message: 'Payment method added successfully',
      paymentMethod,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add payment method', error: err.message });
  }
};

// Get all payment methods for current user
const getMyPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(methods);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch payment methods', error: err.message });
  }
};

// Set default payment method
const setDefaultPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Reset all to non-default
    await PaymentMethod.update({ isDefault: false }, { where: { userId } });

    // Set selected as default
    const method = await PaymentMethod.findOne({ where: { id, userId } });
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    await method.update({ isDefault: true });
    return res.status(200).json({ message: 'Default payment method updated', method });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update default method', error: err.message });
  }
};

// Delete a payment method
const deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Detach from Stripe
    await stripe.paymentMethods.detach(method.stripePaymentMethodId);
    await method.destroy();

    return res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete payment method', error: err.message });
  }
};

module.exports = {
  addPaymentMethod,
  getMyPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
};