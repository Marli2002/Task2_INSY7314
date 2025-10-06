const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist'); //import your blacklist model

async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Check if the token is in the blacklist
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ msg: 'Token has been blacklisted. Please log in again.' });
        }

        //Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
