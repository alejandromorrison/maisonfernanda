require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit in serverless environment
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Don't exit in serverless environment
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

const connectDB = require('./config/database');

const app = express();

// Connect to database (don't crash if it fails in serverless)
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://fernandamaison.com',
      'https://www.fernandamaison.com',
      'https://maison-fernanda-frontend.vercel.app',
      'https://maison-fernanda-backend.vercel.app',
      // Add any other Vercel deployment URLs
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*-alejandros-projects-ebed6ed9\.vercel\.app$/
    ];

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return pattern === origin;
      }
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser - but not for webhook route
app.use((req, res, next) => {
  if (req.originalUrl === '/api/checkout/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/site-content', require('./routes/siteContent'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/pages', require('./routes/pageContent'));
app.use('/api/images', require('./routes/images'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/bank-transfers', require('./routes/bankTransfers'));
app.use('/api/payment-methods', require('./routes/paymentMethods'));

// Simple test route (no database required)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Health check
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
} else {
  console.log('Running in Vercel environment');
}

module.exports = app;

