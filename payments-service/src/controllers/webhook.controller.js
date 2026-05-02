const stripe = require('../config/stripe');
const Payment = require('../models/payment.model');

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        await Payment.update(
          { status: 'succeeded' },
          { where: { stripePaymentIntentId: intent.id } }
        );
        console.log(`Payment succeeded: ${intent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await Payment.update(
          {
            status: 'failed',
            failureReason: intent.last_payment_error?.message || 'Unknown error',
          },
          { where: { stripePaymentIntentId: intent.id } }
        );
        console.log(`Payment failed: ${intent.id}`);
        break;
      }

      case 'payment_intent.processing': {
        const intent = event.data.object;
        await Payment.update(
          { status: 'processing' },
          { where: { stripePaymentIntentId: intent.id } }
        );
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        await Payment.update(
          { status: 'refunded', refundedAt: new Date() },
          { where: { stripePaymentIntentId: charge.payment_intent } }
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ message: 'Webhook processing failed', error: err.message });
  }
};

module.exports = { handleWebhook };