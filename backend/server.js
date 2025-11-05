require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const adminAuthRoutes = require('./routes/adminAuth');
const employeeAuthRoutes = require('./routes/employeeAuth');

//  Connect to MongoDB 
connectDB();

// Initialize Express
const app = express();

// Middleware
// Body parser
app.use(express.json({ limit: '10kb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// CORS (frontend only)
app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true
}));

// Security headers
app.use(helmet());

// Rate limiting (global)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS
app.use(xss());

// CSP / clickjacking protection
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; frame-ancestors 'self'");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

//  Routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));

app.use('/api/employee', require('./routes/employee')); // Employee routes
app.use('/api/admin', require('./routes/admin'));       // Admin routes
// Employee authentication routes
app.use('/api/employee/auth', require('./routes/employeeAuth'));
app.use('/api/admin/auth', require('./routes/adminAuth'));

// HTTPS Setup 
const sslOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
};

// Start Server 
const PORT = process.env.API_PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});


/*
References:

CORS. (n.d.). *CORS middleware for Express*. npm Documentation. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/cors

dotenv. (n.d.). *dotenv documentation*. npm Documentation. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/dotenv

Express.js. (n.d.-a). *Express.js Guide: Middleware*. Express.js Documentation. 
Retrieved October 9, 2025, from https://expressjs.com/en/guide/writing-middleware.html

express-rate-limit. (n.d.). *Express rate-limit documentation*. npm Documentation. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/express-rate-limit

helmet. (n.d.). *Helmet documentation*. npm Documentation. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/helmet

MongoDB. (n.d.). *Connect to MongoDB using Node.js*. MongoDB Documentation. 
Retrieved October 9, 2025, from https://www.mongodb.com/docs/manual/tutorial/getting-started/

Node.js Foundation. (n.d.). *Node.js HTTPS module*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/api/https.html

Node.js Foundation. (n.d.). *Node.js File System (fs) module*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/api/fs.html
*/