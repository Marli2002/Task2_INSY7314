const User = require('../models/User');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// LOGOUT
exports.logout = async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(400).json({ msg: 'No token provided' });

        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });

        res.json({ msg: 'Successfully logged out' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};