const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Employee = require('../models/Employee'); // fixed path

mongoose.connect('mongodb://localhost:27017/paymentdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

async function resetPassword() {
  const hash = await bcrypt.hash("Employee@123!", 10);
  const result = await Employee.updateOne(
    { email: "john@example.com" }, // replace with your employee email
    { $set: { password: hash } }
  );

  if (result.matchedCount === 0) {
    console.log("No employee found with that email.");
  } else {
    console.log("Employee password reset successfully.");
  }

  mongoose.disconnect();
}

resetPassword();
