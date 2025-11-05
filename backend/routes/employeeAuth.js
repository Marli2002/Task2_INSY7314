const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee'); // employees stored here

// Helper: generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// POST /api/employee/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const employee = await Employee.findOne({ email, role: 'employee' });
    if (!employee) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(employee._id);
    res.json({
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
