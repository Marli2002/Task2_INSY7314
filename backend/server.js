// Load environment variables   
require('dotenv').config();

// Check if MONGO_URI is loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// Import dependencies
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const xssClean = require('xss-clean')

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Allow empty bodies without crashing
app.use(express.json({ strict: false }));

app.use(express.json({ limit: '10kb' })); // prevent huge bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// CORS - allow only frontend to access backend
app.use(cors({
    origin: 'https://localhost:5173', // frontend URL
    credentials: true
}));

// Security headers
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());

// CSP / Frame-ancestors (prevent clickjacking)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; frame-ancestors 'self'");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));

// SSL credentials
const sslOptions = {
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.cert')
};

// Use PORT from .env or fallback to 5000
const PORT = process.env.API_PORT || 5000;

// Start HTTPS server
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