const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  markInvoicePaid,
  getAllInvoices,
  cancelInvoice,
} = require('../controllers/invoice.controller');
const {
  subscribe,
  getMySubscription,
  cancelSubscription,
  getAllSubscriptions,
} = require('../controllers/subscription.controller');
const {
  createPlan,
  getPlans,
  updatePlan,
  deactivatePlan,
} = require('../controllers/plan.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Plan routes (public)
router.get('/plans', getPlans);

// Plan routes (admin only)
router.post('/plans', verifyToken, isAdmin, createPlan);
router.put('/plans/:id', verifyToken, isAdmin, updatePlan);
router.patch('/plans/:id/deactivate', verifyToken, isAdmin, deactivatePlan);

// Invoice routes (user)
router.post('/invoices', verifyToken, createInvoice);
router.get('/invoices', verifyToken, getMyInvoices);
router.get('/invoices/:id', verifyToken, getInvoiceById);

// Invoice routes (admin)
router.get('/admin/invoices', verifyToken, isAdmin, getAllInvoices);
router.patch('/admin/invoices/:id/pay', verifyToken, isAdmin, markInvoicePaid);
router.patch('/admin/invoices/:id/cancel', verifyToken, isAdmin, cancelInvoice);

// Subscription routes (user)
router.post('/subscriptions', verifyToken, subscribe);
router.get('/subscriptions/me', verifyToken, getMySubscription);
router.patch('/subscriptions/cancel', verifyToken, cancelSubscription);

// Subscription routes (admin)
router.get('/admin/subscriptions', verifyToken, isAdmin, getAllSubscriptions);

module.exports = router;