const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User 
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // Links to the Project
        required: true,
    },
    weekStartDate: {
        type: Date,
        required: true,
    },
    weekEndDate: {
        type: Date,
        required: true,
    },

    tasksCompleted: {
        type: [String],
        required: true,
    },
    tasksPlanned: {
        type: [String],
        required: true,
    },
    blockers: {
        type: [String],
        required: true,
    },
    hoursWorked: {
        type: Number,
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Late'],
        default: 'Pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);