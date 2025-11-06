const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Employee = require('../models/Employee'); // <-- correct relative path

require('dotenv').config(); // if you use env vars for DB URI

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/paymentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function resetAdminPassword() {
  try {
    const hash = await bcrypt.hash("Admin@123!", 10);
    const result = await Employee.updateOne(
      { email: "admin@example.com", role: "admin" },
      { $set: { password: hash } }
    );

    if (result.matchedCount === 0) {
      console.log("No admin found with that email.");
    } else {
      console.log("Admin password reset successfully.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

resetAdminPassword();
