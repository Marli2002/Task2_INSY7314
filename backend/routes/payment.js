const express = require('express');   
const router = express.Router();
const auth = require('../middleware/auth');
const sanitize = require('mongo-sanitize'); // <--- import mongo-sanitize
const { createPayment, getPayments } = require('../controllers/paymentController');

// Middleware for input validation & sanitization
const validatePayment = (req, res, next) => {
    // Sanitize inputs
    const amount = sanitize(req.body.amount);
    const customerName = sanitize(req.body.customerName);
    const paymentMethod = sanitize(req.body.paymentMethod);

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    // Validate customer name (letters and spaces only, 2-50 chars)
    if (!customerName || !/^[a-zA-Z ]{2,50}$/.test(customerName)) {
        return res.status(400).json({ message: 'Invalid customer name' });
    }

    // Validate payment method
    if (!['card', 'bank', 'cash', 'paypal'].includes(paymentMethod?.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Replace original body with sanitized values
    req.body.amount = amount;
    req.body.customerName = customerName;
    req.body.paymentMethod = paymentMethod;

    next();
};

// Temporary test route
router.post('/test', express.raw({ type: '*/*' }), (req, res) => {
    res.json({ message: 'Payment route works!' });
});

// Actual payment routes
router.post('/', auth, validatePayment, createPayment);
router.get('/', auth, getPayments);

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