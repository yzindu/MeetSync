const express = require('express');
const router = express.Router();
const { createReport, getReports, getAllReports, getDashboardMetrics } = require('../controllers/weeklyReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// create a report for users 
router.post('/', protect, createReport);

// get the reports of the user who is logged in 
router.get('/me', protect, getReports);

// get all the reports for managers and admns
router.get('/', protect, authorize('Manager'), getAllReports);

// get dashboard metrixs for managers 
router.get('/metrics', protect, authorize('Manager'), getDashboardMetrics);

module.exports = router;