const express = require('express');
const router = express.Router();

// Basic site content routes
router.get('/', (req, res) => {
  try {
    res.json({
      heroTitle: 'Maison Fernanda',
      heroSubtitle: 'Luxury Fashion & Style',
      aboutText: 'Welcome to Maison Fernanda - your destination for luxury fashion and timeless style.',
      contactInfo: {
        email: 'info@fernandamaison.com',
        phone: '+1 (555) 123-4567'
      }
    });
  } catch (error) {
    console.error('Site content error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
