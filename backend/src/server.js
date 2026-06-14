const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for audio and models
app.use('/audio', express.static(path.join(__dirname, '../../frontend/public/audio')));
app.use('/models', express.static(path.join(__dirname, '../../frontend/public/models')));
app.use('/markers', express.static(path.join(__dirname, '../../frontend/public/markers')));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'DoaKu AR Backend is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 DoaKu AR Backend running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
});