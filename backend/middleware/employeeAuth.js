// middleware/employeeAuth.js
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const Employee = require('../models/Employee');

async function employeeAuth(req, res, next) {
    try {
        let token = req.cookies?.accessToken || req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
        if (token.startsWith('Bearer ')) token = token.slice(7).trim();

        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) return res.status(401).json({ msg: 'Token blacklisted' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) return res.status(401).json({ msg: 'Invalid token' });

        const employee = await Employee.findById(decoded.id);
        if (!employee) return res.status(401).json({ msg: 'Employee not found' });

        req.employee = employee; // attach employee object
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ msg: 'Token not valid' });
    }
}

module.exports = employeeAuth;
