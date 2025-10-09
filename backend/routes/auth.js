const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const authMiddleware = require('../middleware/auth');

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
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Strong password check
const isStrongPassword = (password) =>
  validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  });

//Register
router.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ msg: 'All fields required' });

    if (!validator.isEmail(email))
      return res.status(400).json({ msg: 'Invalid email' });

    if (!isStrongPassword(password))
      return res.status(400).json({ msg: 'Password too weak' });

    // Data already sanitized in server.js middleware
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12));
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    res.json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    res.json({ token, user: { id: user._id, username: user.username, email } });
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
    if (!decoded?.exp) return res.status(400).json({ msg: 'Invalid token' });

    await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ msg: 'Logged out successfully' });
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