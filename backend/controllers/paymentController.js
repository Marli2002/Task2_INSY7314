// Payment Controller
// Handles creating and retrieving payment records using Express.js and Mongoose

const Payment = require('../models/Payment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    // Destructuring request body to extract fields
    const { amount, customerName, paymentMethod } = req.body;


    // Creating a new payment document using Mongoose Model.create()
    const payment = await Payment.create({
      userId: req.user.id, // from auth middleware
      amount,
      customerName,
      paymentMethod,
      status: 'pending'
    });


    // Sending 201 Created response on success
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    // Handles server-side errors using Express response object
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for logged-in user
exports.getPayments = async (req, res) => {
  try {
    // Find all payment documents associated with the logged-in user
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Sorts payments by most recent
      .select('customerName amount paymentMethod status createdAt'); 

    // Returns the payments as a JSON response
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
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