const express = require('express');
const router = express.Router();
const employeeAuth = require('../middleware/employeeAuth'); 
const roleCheck = require('../middleware/roleAuth');
const { getPendingPayments, approvePayment, getPaymentHistory } = require('../controllers/employeeController');

// Employee-only routes
router.get('/payments/pending', employeeAuth, roleCheck('employee'), getPendingPayments);
router.put('/payments/:id/status', employeeAuth, roleCheck('employee'), approvePayment);
router.get('/payments/history', employeeAuth, roleCheck('employee'), getPaymentHistory);

module.exports = router;
