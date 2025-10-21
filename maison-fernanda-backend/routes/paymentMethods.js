const express = require('express');
const router = express.Router();

// Basic payment methods routes
router.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'Payment methods endpoint working',
      methods: [
        { id: 'credit_card', name: 'Credit Card', enabled: true },
        { id: 'bank_transfer', name: 'Bank Transfer', enabled: true },
        { id: 'paypal', name: 'PayPal', enabled: false }
      ]
    });
  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    res.json({ 
      message: 'Payment method creation endpoint working',
      method: req.body
    });
  } catch (error) {
    console.error('Payment method creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
