const express = require('express');
const dotenv = require('dotenv');

// Load env vars BEFORE anything else
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');

// Connect to database AFTER dotenv
connectDB();

// Route files
const bookings = require('./routes/bookings');

const app = express();

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/bookings', bookings);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    'Server running in',
    process.env.NODE_ENV,
    'mode on port',
    PORT
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});