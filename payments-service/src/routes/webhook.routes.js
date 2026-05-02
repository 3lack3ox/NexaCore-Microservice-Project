const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhook.controller');

// Stripe webhook (raw body required — set in index.js)
router.post('/webhook', handleWebhook);

module.exports = router;