const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  customerName: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);


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