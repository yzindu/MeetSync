// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProjects, getProjects } = require('../controllers/projectController');
const { authorize } = require('../middleware/authMiddleware');

// post api/projects/create
router.post('/create', protect, authorize('Manager'), createProjects);

// Get api/projects
router.get('/', protect, authorize('Manager'), getProjects);

// export router
module.exports = router;