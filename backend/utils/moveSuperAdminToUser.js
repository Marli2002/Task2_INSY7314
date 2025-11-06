require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const empAdmin = await Employee.findOne({ email: process.env.SUPERADMIN_EMAIL });
  if (!empAdmin) {
    console.log("No admin found in Employee collection");
    process.exit();
  }

  // Check if admin already exists in User
  const existingUser = await User.findOne({ email: process.env.SUPERADMIN_EMAIL });
  if (existingUser) {
    console.log("Admin already exists in User collection");
    process.exit();
  }

  // Create User-admin (will hash password)
  const newUser = await User.create({
    username: empAdmin.username,
    email: empAdmin.email,
    password: empAdmin.password // User model will hash it
  });

  console.log("Superadmin moved to User collection:", newUser.email);

  process.exit();
})();
