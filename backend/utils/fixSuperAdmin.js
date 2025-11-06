require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // User model
const connectDB = require('../config/db');

async function createSuperAdmin() {
    try {
        await connectDB();

        // Check if superadmin exists
        const existingAdmin = await User.findOne({ email: process.env.SUPERADMIN_EMAIL });
        if (existingAdmin) {
            console.log(`Superadmin already exists: ${existingAdmin.email}`);
            process.exit(0);
        }

        // Create User-admin (User model will hash password)
        const admin = await User.create({
            username: process.env.SUPERADMIN_USERNAME,
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWORD
        });

        console.log(`Superadmin created successfully in User collection: ${admin.email}`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating superadmin:', err.message);
        process.exit(1);
    }
}

createSuperAdmin();
