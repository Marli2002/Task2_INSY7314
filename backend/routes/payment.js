const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPayment, getPayments, getAllPendingPaymentsForEmployees, updatePaymentStatus, getPaymentHistory } = require('../controllers/paymentController');

// Simple input validation middleware
const validatePayment = (req, res, next) => {
  const { amount, customerName, paymentMethod } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0)
    return res.status(400).json({ message: 'Invalid amount' });

  if (!customerName || !/^[a-zA-Z ]{2,50}$/.test(customerName))
    return res.status(400).json({ message: 'Invalid customer name' });

  if (!paymentMethod || !['card', 'bank', 'cash', 'paypal'].includes(paymentMethod.toLowerCase()))
    return res.status(400).json({ message: 'Invalid payment method' });

  next();
};

// Routes
router.post('/', auth, validatePayment, createPayment);
router.get('/', auth, getPayments);
router.patch('/:id/status', auth, updatePaymentStatus);
router.get('/history', auth, getPaymentHistory);
router.get('/pending-all', getAllPendingPaymentsForEmployees);

module.exports = router;

/*
References:
Auth0. (n.d.). *Learn about JSON Web Tokens (JWT)*. Auth0 Documentation. 
Retrieved October 9, 2025, from https://auth0.com/learn/json-web-tokens/

Express.js. (n.d.-a). *Routing*. Express.js Documentation. 
Retrieved October 9, 2025, from https://expressjs.com/en/guide/routing.html

MDN Web Docs. (n.d.). *Regular expressions*. Mozilla Developer Network. 
Retrieved October 9, 2025, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. 
Retrieved October 9, 2025, from https://mongoosejs.com/docs/models.html

mongo-sanitize. (n.d.). *Prevent MongoDB operator injection*. npm Documentation. 
Retrieved October 9, 2025, from https://www.npmjs.com/package/mongo-sanitize

*/