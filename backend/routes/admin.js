const express = require('express');
const router = express.Router();
const employeeAuth = require('../middleware/employeeAuth');
const roleCheck = require('../middleware/roleAuth');
const { getEmployees, createEmployee, deleteEmployee } = require('../controllers/adminController');

// Admin-only routes
router.get('/employees', employeeAuth, roleCheck('admin'), getEmployees);
router.post('/employees', employeeAuth, roleCheck('admin'), createEmployee);
router.delete('/employees/:id', employeeAuth, roleCheck('admin'), deleteEmployee);

module.exports = router;
