const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/users — get all team members (Manager only)
router.get('/', protect, authorize('Manager'), getUsers);

module.exports = router;
