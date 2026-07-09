const User = require('../models/User');

// Get all users (Manager only) — for dashboard filters
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role createdAt');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};
