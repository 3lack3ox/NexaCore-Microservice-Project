const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getMyPayments,
  getPaymentById,
  refundPayment,
  getAllPayments,
} = require('../controllers/payment.controller');
const {
  addPaymentMethod,
  getMyPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentMethod.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Payment intent routes (user)
router.post('/intent', verifyToken, createPaymentIntent);
router.get('/', verifyToken, getMyPayments);
router.get('/:id', verifyToken, getPaymentById);
router.post('/:id/refund', verifyToken, refundPayment);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, getAllPayments);

// Payment method routes (user)
router.post('/methods', verifyToken, addPaymentMethod);
router.get('/methods/me', verifyToken, getMyPaymentMethods);
router.patch('/methods/:id/default', verifyToken, setDefaultPaymentMethod);
router.delete('/methods/:id', verifyToken, deletePaymentMethod);

module.exports = router;