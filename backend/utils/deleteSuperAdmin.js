require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const result = await User.deleteOne({ email: process.env.SUPERADMIN_EMAIL });

    if (result.deletedCount > 0) {
      console.log(`✅ Superadmin deleted: ${process.env.SUPERADMIN_EMAIL}`);
    } else {
      console.log(`⚠️ No superadmin found with email: ${process.env.SUPERADMIN_EMAIL}`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

