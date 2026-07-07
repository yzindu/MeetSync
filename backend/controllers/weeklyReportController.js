// backend/controllers/weeklyReportController.js

const Report = require('../models/Report');

// create a new report 
exports.createReport = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            projectId,
            weekStartDate,
            weekEndDate,
            tasksCompleted,
            tasksPlanned,
            blockers,
            hoursWorked,
            notes,
            status
        } = req.body;

        const Report = await Report.create({
            userId,
            projectId,
            weekStartDate,
            weekEndDate,
            tasksCompleted,
            tasksPlanned,
            blockers,
            hoursWorked,
            notes,
            status
        });
        res.status(201).json(Report)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during report creation' });
    }
}

// get reports
exports.getReports = async (req, res) => {
    try {
        const Report = await Report.find({ userId: req.user.id })
            .populate('projectId', 'name')
            .sort({ weekStartDate: -1 });

        res.status(200).json(Report)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during report fetching' });
    }
}

// update report 