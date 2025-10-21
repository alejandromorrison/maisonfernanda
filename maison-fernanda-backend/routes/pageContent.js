const express = require('express');
const router = express.Router();

// Basic page content routes
router.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'Page content endpoint working',
      pages: []
    });
  } catch (error) {
    console.error('Page content error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    res.json({ 
      slug: slug,
      title: 'Page Title',
      content: 'Page content would go here',
      message: 'Page content endpoint working'
    });
  } catch (error) {
    console.error('Page content error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
