// controllers/adminController.js
const Employee = require('../models/Employee');
const sanitize = require('mongo-sanitize');

// List employees (no password)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}, '-password').sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create employee
exports.createEmployee = async (req, res) => {
    try {
        const username = sanitize(req.body.username?.trim());
        const email = sanitize(req.body.email?.trim());
        const password = req.body.password; // raw password
        const role = 'employee'; // enforce employee role for created users

        // Validation
        if (!username || username.length < 3 || username.length > 20)
            return res.status(400).json({ message: 'Invalid username' });

        if (!email || !/^\S+@\S+\.\S+$/.test(email))
            return res.status(400).json({ message: 'Invalid email' });

        if (!password || password.length < 8) // simple validation, you can add stronger checks
            return res.status(400).json({ message: 'Password too short (min 8 chars)' });

        // Check if email already exists
        const existing = await Employee.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        // Create employee (password will be hashed automatically by pre-save hook)
        const employee = await Employee.create({ username, email, password, role });

        res.status(201).json({ 
            employee: { id: employee._id, username, email, role } 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });

        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
