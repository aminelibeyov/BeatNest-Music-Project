const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
const passport = require('passport');
const dns = require('dns');

require('./config/passport');

const { morganMiddleware, logger } = require('./middlewares/logger.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const apiRoutes = require('./routes/index');

const app = express();

// DNS servers
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morganMiddleware);

// Passport
app.use(passport.initialize());

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;