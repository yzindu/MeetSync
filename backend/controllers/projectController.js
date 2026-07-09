const Project = require('../models/Project');

// Create a new project 
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({ name, description });
        res.status(201).json(project);

    } catch (error) {
        // Handle duplicate project name error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Project name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all active projects 
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a project Manager only
exports.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Project name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// delete a project Manager only
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};