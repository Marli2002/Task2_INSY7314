
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee'); // Adjust path if needed
const connectDB = require('../config/db');

// Config
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123!'; // Ensure strong password

async function createSuperAdmin() {
    try {
        await connectDB();

        // Check if superadmin exists
        const existingAdmin = await Employee.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`Superadmin already exists: ${existingAdmin.email}`);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, salt);

        const admin = await Employee.create({
            username: SUPERADMIN_USERNAME,
            email: SUPERADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`Superadmin created successfully: ${admin.email}`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating superadmin:', err.message);
        process.exit(1);
    }
}

createSuperAdmin();
