const Payment = require('../models/Payment');
const xss = require('xss');

// View pending payments
exports.getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pending' }).sort({ createdAt: -1 });
        const safePayments = payments.map(p => ({ ...p._doc, customerName: xss(p.customerName) }));
        res.json(safePayments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve or deny a payment
exports.approvePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'denied'].includes(status))
            return res.status(400).json({ message: 'Invalid status' });

        const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// View history (approved/denied payments)
exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ status: { $in: ['approved', 'denied'] } }).sort({ updatedAt: -1 });
        const safePayments = payments.map(p => ({ ...p._doc, customerName: xss(p.customerName) }));
        res.json(safePayments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
