const express = require('express');
const router = express.Router();

// Basic bank transfer routes
router.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'Bank transfers endpoint working',
      transfers: []
    });
  } catch (error) {
    console.error('Bank transfers error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    res.json({ 
      message: 'Bank transfer creation endpoint working',
      transfer: req.body
    });
  } catch (error) {
    console.error('Bank transfer creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
