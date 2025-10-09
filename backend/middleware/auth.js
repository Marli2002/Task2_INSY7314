const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Check if the token is blacklisted
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ msg: 'Token has been blacklisted. Please log in again.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to req.user
        req.user = { id: decoded.id };  

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
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