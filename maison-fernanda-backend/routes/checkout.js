const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST /api/checkout/create-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-session', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingPrice = subtotal > 200 ? 0 : 15; // Free shipping over $200
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalPrice = subtotal + shippingPrice + taxAmount;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.product,
            size: item.size || '',
            color: item.color || ''
          }
        },
        unit_amount: Math.round(item.price * 100) // Convert to cents
      },
      quantity: item.quantity
    }));

    // Add shipping
    if (shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping'
          },
          unit_amount: Math.round(shippingPrice * 100)
        },
        quantity: 1
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });

    // Create order in pending state
    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      shippingAddress,
      paymentMethod: 'stripe',
      subtotal,
      taxAmount,
      shippingPrice,
      totalPrice,
      stripeSessionId: session.id
    });

    res.json({
      sessionId: session.id,
      orderId: order._id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/checkout/webhook
// @desc    Handle Stripe webhook events
// @access  Public (but verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update order as paid
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'processing';
      order.paymentResult = {
        id: session.payment_intent,
        status: session.payment_status,
        updateTime: new Date().toISOString(),
        emailAddress: session.customer_email
      };
      await order.save();
    }
  }

  res.json({ received: true });
});

module.exports = router;

