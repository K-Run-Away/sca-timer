const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// For Vercel serverless deployment
const isVercel = process.env.VERCEL === '1';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Data file path - use /tmp for Vercel serverless environment
const feedbackFile = isVercel ? '/tmp/feedback.json' : path.join(__dirname, 'feedback.json');

// Initialize feedback file if it doesn't exist
async function initializeFeedbackFile() {
    try {
        await fs.access(feedbackFile);
    } catch {
        await fs.writeFile(feedbackFile, JSON.stringify([]));
    }
}

// Load existing feedback
async function loadFeedback() {
    try {
        const data = await fs.readFile(feedbackFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save feedback to file
async function saveFeedback(feedback) {
    await fs.writeFile(feedbackFile, JSON.stringify(feedback, null, 2));
}

// Routes
app.post('/api/feedback', async (req, res) => {
    try {
        const { rating, mode } = req.body;
        
        // Validate input
        if (!rating || !['positive', 'negative'].includes(rating)) {
            return res.status(400).json({ error: 'Invalid rating' });
        }
        
        if (!mode || !['standard', 'guided'].includes(mode)) {
            return res.status(400).json({ error: 'Invalid mode' });
        }
        
        // Create minimal feedback object (no personal data)
        const feedbackEntry = {
            rating,
            mode,
            timestamp: new Date().toISOString()
        };
        
        // Load existing feedback and add new entry
        const feedback = await loadFeedback();
        feedback.push(feedbackEntry);
        await saveFeedback(feedback);
        
        console.log('Feedback received:', feedbackEntry);
        
        res.json({ success: true, message: 'Feedback recorded' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Get feedback summary (for admin purposes)
app.get('/api/feedback', async (req, res) => {
    try {
        const feedback = await loadFeedback();
        
        // Create summary statistics
        const summary = {
            total: feedback.length,
            positive: feedback.filter(f => f.rating === 'positive').length,
            negative: feedback.filter(f => f.rating === 'negative').length,
            byMode: {
                standard: feedback.filter(f => f.mode === 'standard').length,
                guided: feedback.filter(f => f.mode === 'guided').length
            },
            recent: feedback.slice(-10) // Last 10 entries
        };
        
        res.json(summary);
    } catch (error) {
        console.error('Error loading feedback:', error);
        res.status(500).json({ error: 'Failed to load feedback' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server (only for local development)
async function startServer() {
    if (!isVercel) {
        await initializeFeedbackFile();
        
        app.listen(PORT, () => {
            console.log(`SCA Timer server running on port ${PORT}`);
            console.log(`Open http://localhost:${PORT} to use the timer`);
            console.log(`Feedback endpoint: http://localhost:${PORT}/api/feedback`);
            console.log(`Feedback summary: http://localhost:${PORT}/api/feedback (GET)`);
        });
    }
}

// For Vercel serverless deployment
if (isVercel) {
    // Initialize feedback file for serverless environment
    initializeFeedbackFile().catch(console.error);
}

startServer().catch(console.error);

// Export for Vercel
module.exports = app; 