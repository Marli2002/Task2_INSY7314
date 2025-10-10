const express = require('express');
const router = express.Router();
const validator = require('validator');
const sanitize = require('mongo-sanitize');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Security headers
router.use(helmet());

// Rate limiting for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, try again later."
});
router.use(['/login', '/register'], authLimiter);

// JWT generator
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Strong password check
const isStrongPassword = (password) =>
  validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  });

// Register route
router.post('/register', async (req, res) => {
  try {
    const username = sanitize(req.body.username?.trim());
    const email = sanitize(req.body.email?.trim());
    const password = req.body.password;

    if (!username || username.length < 3 || username.length > 20)
      return res.status(400).json({ message: 'Invalid username' });

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!password || !isStrongPassword(password))
      return res.status(400).json({ message: 'Password not strong enough' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Pass raw password (model will hash it)
    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({ user: { id: user._id, username, email }, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const email = sanitize(req.body.email?.trim());
    const password = req.body.password;

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!password) return res.status(400).json({ message: 'Password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.json({ user: { id: user._id, username: user.username, email }, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    let token = req.cookies?.accessToken || req.header('x-auth-token');
    if (!token) return res.status(400).json({ message: 'No token provided' });
    if (token.startsWith('Bearer ')) token = token.slice(7).trim();

    const decoded = jwt.decode(token);
    if (!decoded?.exp) return res.status(400).json({ message: 'Invalid token' });

    await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
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