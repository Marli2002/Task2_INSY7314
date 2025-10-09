const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

// Automatically remove expired tokens
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);


/*
References:
Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/models.html

Mongoose. (n.d.-b). *Schemas*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/guide.html

Mongoose. (n.d.-c). *Indexes*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/guide.html#indexes

MongoDB. (n.d.-a). *TTL indexes*. MongoDB Documentation. 
Retrieved October 9, 2025, from https://www.mongodb.com/docs/manual/core/index-ttl/

Node.js Foundation. (n.d.). *Modules: CommonJS modules*. Node.js Documentation. 
Retrieved October 9, 2025, from https://nodejs.org/api/modules.html
*/