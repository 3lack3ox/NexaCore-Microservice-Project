const stripe = require('../config/stripe');
const Payment = require('../models/payment.model');
const PaymentMethod = require('../models/payment_method.model');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, invoiceId, description } = req.body;
    const userId = req.user.id;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: currency || 'usd',
      metadata: { userId, invoiceId },
      description,
    });

    // Record payment in DB
    const payment = await Payment.create({
      userId,
      invoiceId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: currency || 'usd',
      description,
      status: 'pending',
      metadata: { paymentIntentId: paymentIntent.id },
    });

    return res.status(201).json({
      message: 'Payment intent created',
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create payment intent', error: err.message });
  }
};

// Get all payments for current user
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};

// Get single payment
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch payment', error: err.message });
  }
};

// Refund a payment
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'succeeded') {
      return res.status(400).json({ message: 'Only succeeded payments can be refunded' });
    }

    // Process refund with Stripe
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    await payment.update({ status: 'refunded', refundedAt: new Date() });

    return res.status(200).json({ message: 'Payment refunded successfully', payment });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to refund payment', error: err.message });
  }
};

// Admin: Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};

module.exports = {
  createPaymentIntent,
  getMyPayments,
  getPaymentById,
  refundPayment,
  getAllPayments,
};