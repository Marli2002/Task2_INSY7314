const User = require('../models/User');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const authMiddleware = require('../middleware/auth');
const validator = require('validator'); // added for input validation
const sanitize = require('mongo-sanitize'); // prevent NoSQL injection

// Generate JWT token using jsonwebtoken
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Strong password check
const isStrongPassword = (password) => {
  // at least 8 chars, upper, lower, digit, special
  return validator.isStrongPassword(password, {
    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  });
}

// Register
exports.register = async (req, res) => {
  try {
    // Sanitize inputs
    const username = sanitize(req.body.username?.trim());
    const email = sanitize(req.body.email?.trim());
    const password = req.body.password;

    // Input validation
    if (!username || username.length < 3 || username.length > 20)
      return res.status(400).json({ message: 'Invalid username' });

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!password || !isStrongPassword(password))
      return res.status(400).json({ message: 'Password not strong enough' });

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = await User.create({ username, email, password });

    // Set JWT in HttpOnly cookie
    const token = generateToken(user._id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return minimal JSON
    res.status(201).json({ user: { id: user._id, username, email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Login
exports.login = async (req, res) => {
  try {
    // Sanitize inputs
    const email = sanitize(req.body.email?.trim());
    const password = req.body.password;

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!password) return res.status(400).json({ message: 'Password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // Set JWT in HttpOnly cookie
    const token = generateToken(user._id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ user: { id: user._id, username: user.username, email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Logout
exports.logout = async (req, res) => {
  try {
    const token = req.header('x-auth-token') || req.cookies?.accessToken;
    if (!token) return res.status(400).json({ msg: 'No token provided' });

    // Decode token to access expiry
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    // Store token in blacklist until expiry
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
};


/*
References:
Auth0. (n.d.). *Learn about JSON Web Tokens (JWT)*. Auth0 Documentation. 
Retrieved October 9, 2025, from https://auth0.com/learn/json-web-tokens/

Express.js. (n.d.-a). *Response methods*. Express. Retrieved October 9, 2025, from 
https://expressjs.com/en/api.html#res

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. Retrieved October 9, 2025, from 
https://mongoosejs.com/docs/models.html

Mongoose. (n.d.-b). *Queries*. Mongoose ODM Documentation. Retrieved October 9, 2025, from 
https://mongoosejs.com/docs/queries.html

Mozilla Developer Network (MDN). (n.d.). *HTTP response status codes*. MDN Web Docs. 
Retrieved October 9, 2025, from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

Node.js Foundation. (n.d.). *Error handling*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/en/learn

jsonwebtoken. (n.d.). *jsonwebtoken API documentation*. npm. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/jsonwebtoken
*/