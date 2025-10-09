const User = require('../models/User');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Generate JWT token using jsonwebtoken
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = await User.create({ username, email, password });

    // Return JWT token upon successful registration
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
}

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      // 401 Unauthorized - Invalid credentials
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