require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeFirebase } = require('./config/firebase');
const { connectDB } = require('./config/mongodb');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'ZT Addiction Notifications Service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/notifications/health',
      newOrder: 'POST /api/notifications/new-order',
      orderStatus: 'POST /api/notifications/order-status',
      newProduct: 'POST /api/notifications/new-product',
      specialOffer: 'POST /api/notifications/special-offer',
      custom: 'POST /api/notifications/custom',
      sendToToken: 'POST /api/notifications/send-to-token'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize Firebase
    initializeFirebase();
    
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🔔 Notification Service Started`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();
