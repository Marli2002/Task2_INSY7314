const Payment = require('../models/Payment');
const sanitize = require('mongo-sanitize'); // prevent NoSQL injection
const xss = require('xss'); // sanitize user input for XSS
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Apply security headers
// Ideally applied globally in app.js, but safe to re-apply here
const secureHeaders = (req, res, next) => {
    helmet()(req, res, next);
};

// Rate limiter for payments (prevent brute-force/flood attacks)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per window
    message: 'Too many requests from this IP, please try again later.'
});

exports.createPayment = [
    secureHeaders,
    paymentLimiter,
    async (req, res) => {
        try {
            // Sanitize and validate inputs
            let amount = Number(sanitize(req.body.amount));
            let customerName = xss(sanitize(req.body.customerName?.trim()));
            let paymentMethod = xss(sanitize(req.body.paymentMethod?.trim().toLowerCase()));

            // Validate amount
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: 'Invalid amount' });
            }

            // Validate customer name (letters and spaces only, 2-50 chars)
            if (!customerName || !/^[a-zA-Z ]{2,50}$/.test(customerName)) {
                return res.status(400).json({ message: 'Invalid customer name' });
            }

            // Validate payment method (whitelist)
            if (!['card', 'bank', 'cash', 'paypal'].includes(paymentMethod)) {
                return res.status(400).json({ message: 'Invalid payment method' });
            }

            // Create payment
            const payment = await Payment.create({
                userId: req.user.id,
                amount,
                customerName,
                paymentMethod,
                status: 'pending'
            });

            // XSS-safe output
            const safePayment = {
                ...payment._doc,
                customerName: xss(payment.customerName)
            };

            res.status(201).json(safePayment);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.getPayments = [
    secureHeaders,
    paymentLimiter,
    async (req, res) => {
        try {
            const payments = await Payment.find({ userId: req.user.id })
                .sort({ createdAt: -1 })
                .select('customerName amount paymentMethod status createdAt');

            // Sanitize output to prevent XSS
            const safePayments = payments.map(p => ({
                ...p._doc,
                customerName: xss(p.customerName)
            }));

            res.status(200).json(safePayments);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];


/*
References:

Express.js. (n.d.-a). *Response methods*. Express. Retrieved October 9, 2025, from 
https://expressjs.com/en/api.html#res

Express.js. (n.d.-b). *Using middleware*. Express. Retrieved October 9, 2025, from 
https://expressjs.com/en/guide/using-middleware.html

Mongoose. (n.d.-a). *Models*. Mongoose ODM Documentation. Retrieved October 9, 2025, from 
https://mongoosejs.com/docs/models.html

Mongoose. (n.d.-b). *Queries*. Mongoose ODM Documentation. Retrieved October 9, 2025, from 
https://mongoosejs.com/docs/queries.html

Mozilla Developer Network (MDN). (n.d.). *HTTP response status codes*. MDN Web Docs. 
Retrieved October 9, 2025, from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

Node.js Foundation. (n.d.). *Error handling*. Node.js Documentation. Retrieved October 9, 2025, from 
https://nodejs.org/en/learn

Scotch.io. (2019). *Build a RESTful API using Node and Express 4*. Retrieved October 9, 2025, from 
https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
*/