const mongoose = require('mongoose');

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