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

        const report = await Report.create({
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
        res.status(201).json(report)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during report creation' });
    }
}

// get report of the users 
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id })
            .populate('projectId', 'name')
            .sort({ weekStartDate: -1 });

        res.status(200).json(reports)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during report fetching' });
    }
}

// Get fillered report for managers only 

exports.getAllReports = async (req, res) => {
    try {
        const { userId, projectId, status, weekStartDate, weekEndDate } = req.query;

        const filter = {};
        if (userId) filter.userId = userId;
        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;

        if (weekStartDate && weekEndDate) {
            filter.weekStartDate = { $gte: new Date(weekStartDate) };
            filter.weekEndDate = { $lte: new Date(weekEndDate) };
        }

        const reports = await Report.find(filter)
            .populate('userId', 'name')
            .populate('projectId', 'name')
            .sort({ weekStartDate: -1 });

        res.status(200).json(reports);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during report fetching' });
    }
}


// et dashboard summary metrics for managers 
exports.getDashboardMetrics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Date Filtering 
        let matchStage = {};
        if (startDate && endDate) {
            matchStage.weekStartDate = { $gte: new Date(startDate) };
            matchStage.weekEndDate = { $lte: new Date(endDate) };
        }

        // MongoDB aggregation pipeline
        const metrics = await Report.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null, // Group everything into one single result
                    totalReports: { $sum: 1 },
                    submittedReports: {
                        $sum: { $cond: [{ $eq: ["$status", "Submitted"] }, 1, 0] }
                    },
                    pendingReports: {
                        $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
                    },
                    // Count reports where the blockers array has at least 1 item
                    reportsWithBlockers: {
                        $sum: {
                            $cond: [
                                { $gt: [{ $size: { $ifNull: ["$blockers", []] } }, 0] }, 1, 0
                            ]
                        }
                    }
                }
            }
        ]);

        // Format the response 
        if (metrics.length === 0) {
            return res.status(200).json({
                totalReports: 0, submittedReports: 0, pendingReports: 0,
                complianceRate: "0%", reportsWithBlockers: 0
            });
        }

        const data = metrics[0];

        // Calculate the percentage of submitted reports
        const complianceRate = data.totalReports > 0
            ? Math.round((data.submittedReports / data.totalReports) * 100)
            : 0;

        res.status(200).json({
            totalReports: data.totalReports,
            submittedReports: data.submittedReports,
            pendingReports: data.pendingReports,
            complianceRate: `${complianceRate}%`,
            reportsWithBlockers: data.reportsWithBlockers
        });

    } catch (error) {
        console.error('Metrics Error:', error);
        res.status(500).json({ message: 'Server error fetching metrics' });
    }
};

// Get a single report by ID (owner or manager)
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('projectId', 'name')
            .populate('userId', 'name email');

        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Only the owner or a Manager can view it
        if (req.user.role !== 'Manager' && report.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this report' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching report' });
    }
};

// Update own report (Member can edit Pending or Late reports)
exports.updateReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Only the report owner can edit it
        if (report.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this report' });
        }

        const {
            projectId, weekStartDate, weekEndDate,
            tasksCompleted, tasksPlanned, blockers,
            hoursWorked, notes, status
        } = req.body;

        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            { projectId, weekStartDate, weekEndDate, tasksCompleted, tasksPlanned, blockers, hoursWorked, notes, status },
            { new: true, runValidators: true }
        ).populate('projectId', 'name');

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating report' });
    }
};