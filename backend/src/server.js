require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Allow all origins (standard for public/Replit testing)
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import and mount routers (CQRS)
const queryRouter = require('./routes/queries');
const commandRouter = require('./routes/commands');
const auditRouter = require('./routes/audit');

app.use('/api/shipments', queryRouter);
app.use('/api/shipments', commandRouter);
app.use('/api/events', auditRouter);

// Enhanced Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Health check enhanced by your AI assistant!'
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
