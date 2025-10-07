const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank', 'cash', 'paypal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
