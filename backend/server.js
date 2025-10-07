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

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Fixed: allow empty bodies without crashing
app.use(express.json({ strict: false }));

app.use(cors());
app.use(helmet());

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
