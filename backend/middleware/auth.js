const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const mongoSanitize = require('mongo-sanitize');

// Auth middleware
async function auth(req, res, next) {
  try {
    mongoSanitize(req.query);
    mongoSanitize(req.params);
    if (req.headers['x-auth-token']) {
      req.headers['x-auth-token'] = mongoSanitize(req.headers['x-auth-token']);
    }

    let token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
         || req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if (token.startsWith('Bearer ')) token = token.slice(7).trim();

    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) return res.status(401).json({ msg: 'Token blacklisted' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ msg: 'Invalid token' });

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;






/*
References:

Auth0. (n.d.). *Learn about JSON Web Tokens (JWT)*. Auth0 Documentation. 
Retrieved October 9, 2025, from https://auth0.com/learn/json-web-tokens/

Express.js. (n.d.-a). *Response methods*. Express. Retrieved October 9, 2025, from 
https://expressjs.com/en/api.html#res

Express.js. (n.d.-b). *Request object*. Express. Retrieved October 9, 2025, from 
https://expressjs.com/en/api.html#req

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. Retrieved October 9, 2025, from 
https://mongoosejs.com/docs/models.html

Mozilla Developer Network (MDN). (n.d.). *HTTP response status codes*. MDN Web Docs. 
Retrieved October 9, 2025, from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

Node.js Foundation. (n.d.). *Error handling*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/en/learn

jsonwebtoken. (n.d.). *jsonwebtoken API documentation*. npm. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/jsonwebtoken
*/