const express = require('express');
const router = express.Router();
const {
    createReport,
    getReports,
    getAllReports,
    getDashboardMetrics,
    getChartData,
    getReportById,
    updateReport
} = require('../controllers/weeklyReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/reports — create a new report (authenticated users)
router.post('/', protect, createReport);

// GET /api/reports/me — get current user's own reports
router.get('/me', protect, getReports);

// GET /api/reports/metrics — summary KPI metrics (Manager only)
router.get('/metrics', protect, authorize('Manager'), getDashboardMetrics);

// GET /api/reports/charts — chart data: tasks trend, workload, status by member (Manager only)
router.get('/charts', protect, authorize('Manager'), getChartData);

// GET /api/reports — all reports with filters (Manager only)
router.get('/', protect, authorize('Manager'), getAllReports);

// GET /api/reports/:id — get single report (owner or manager)
router.get('/:id', protect, getReportById);

// PUT /api/reports/:id — update own report
router.put('/:id', protect, updateReport);

module.exports = router;