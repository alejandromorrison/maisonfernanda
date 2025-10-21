const express = require('express');
const router = express.Router();

// Basic newsletter routes
router.post('/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // In a real implementation, you would save this to a database
    console.log('Newsletter subscription:', email);
    
    res.json({ 
      message: 'Successfully subscribed to newsletter',
      email: email
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'Newsletter endpoint working',
      subscribers: 0 // Would come from database
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
