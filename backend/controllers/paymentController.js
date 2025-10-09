const Payment = require('../models/Payment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, customerName, paymentMethod } = req.body;

    const payment = await Payment.create({
      userId: req.user.id, // from auth middleware
      amount,
      customerName,
      paymentMethod,
      status: 'pending'
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for logged-in user
// Get all payments for logged-in user
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('customerName amount paymentMethod status createdAt'); 

    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
