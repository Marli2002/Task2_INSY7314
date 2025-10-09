const Payment = require('../models/Payment');
const xss = require('xss'); // sanitize output

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, customerName, paymentMethod } = req.body;

    const payment = await Payment.create({
      userId: req.user.id, // from auth middleware
      amount: Number(amount),
      customerName: xss(customerName.trim()),
      paymentMethod: paymentMethod.toLowerCase(),
      status: 'pending'
    });

    res.status(201).json(payment);

  } catch (err) {
    console.error('Create payment error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    // Sanitize output
    const safePayments = payments.map(p => ({
      ...p._doc,
      customerName: xss(p.customerName)
    }));

    res.status(200).json(safePayments);

  } catch (err) {
    console.error('Get payments error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


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