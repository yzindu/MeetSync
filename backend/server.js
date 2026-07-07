// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:');
        console.error(err);
    });

// --- 3. ROUTES ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Weekly Report API is up and running!' });
});

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});