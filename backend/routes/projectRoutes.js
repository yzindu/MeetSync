const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// post api/projects/create
router.post('/create', protect, authorize('Manager'), createProject);

// Get api/projects
router.get('/', protect, authorize('Manager'), getProjects);

// export router
module.exports = router;