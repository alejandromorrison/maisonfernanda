const express = require('express');
const router = express.Router();

// Basic rental routes
router.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'Rentals endpoint working',
      rentals: []
    });
  } catch (error) {
    console.error('Rentals error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    res.json({ 
      message: 'Rental creation endpoint working',
      rental: req.body
    });
  } catch (error) {
    console.error('Rental creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
