const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // added for hashing
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Pre-save: hash password if modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Enforce strong password
    if (!validator.isStrongPassword(this.password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
        throw new Error('Password not strong enough');
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


/*
References:

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/models.html

Mongoose. (n.d.-b). *Schemas*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/guide.html

MongoDB. (n.d.). *Data modeling introduction*. MongoDB Documentation. 
Retrieved October 9, 2025, from https://www.mongodb.com/docs/manual/core/data-modeling-introduction/

Node.js Foundation. (n.d.). *Modules: CommonJS modules*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/api/modules.html

*/