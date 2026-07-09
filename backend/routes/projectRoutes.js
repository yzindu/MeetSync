const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET api/projects — open to all authenticated users (Members need this to fill the report form)
router.get('/', protect, getProjects);

// POST api/projects/create — Manager only
router.post('/create', protect, authorize('Manager'), createProject);

// PUT api/projects/:id — Manager only
router.put('/:id', protect, authorize('Manager'), updateProject);

// DELETE api/projects/:id — Manager only
router.delete('/:id', protect, authorize('Manager'), deleteProject);

module.exports = router;