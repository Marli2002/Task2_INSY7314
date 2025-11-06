// utils/checkCollections.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const userAdmin = await User.findOne({ email: process.env.SUPERADMIN_EMAIL });
  const empAdmin = await Employee.findOne({ email: process.env.SUPERADMIN_EMAIL });

  console.log('User collection:', userAdmin ? 'FOUND' : 'NOT FOUND');
  console.log('Employee collection:', empAdmin ? 'FOUND' : 'NOT FOUND');

  process.exit();
})();
