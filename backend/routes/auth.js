const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // for input sanitization
const xss = require('xss'); // sanitize strings
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const authMiddleware = require('../middleware/auth');

// Security Middlewares
router.use(helmet()); // Clickjacking, XSS, HSTS, etc.

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10, // 10 attempts per IP
    message: "Too many requests, please try again later."
});
router.use(['/login', '/register'], authLimiter);

// Helper Functions 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Strong password validation
const isStrongPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });
};

// Register
router.post('/register', async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email format' });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ msg: 'Password is not strong enough' });
        }

        // Sanitize inputs
        username = xss(username.trim());
        email = xss(email.trim().toLowerCase());

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(12); // stronger salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser._id);

        // Set secure httpOnly cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        res.json({ user: { id: newUser._id, username, email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

        email = xss(email.trim().toLowerCase());

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = generateToken(user._id);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        res.json({ user: { id: user._id, username: user.username, email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header('x-auth-token');
        if (!token) return res.status(400).json({ msg: 'No token provided' });

        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return res.status(400).json({ msg: 'Invalid token' });

        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });

        // Clear cookie
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({ msg: 'Successfully logged out' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


/*
References:

bcrypt.js. (n.d.). *bcrypt.js documentation*. Retrieved October 9, 2025, 
from https://www.npmjs.com/package/bcryptjs

Express.js. (n.d.-a). *Express routing*. Express.js Documentation. 
Retrieved October 9, 2025, from https://expressjs.com/en/guide/routing.html

JSON Web Token. (n.d.). *jsonwebtoken documentation*. Retrieved October 9, 2025, 
from https://www.npmjs.com/package/jsonwebtoken

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/models.html

Mongoose. (n.d.-b). *Middleware*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/middleware.html

*/