const fs = require('fs').promises;
const path = require('path');

// Data file path for Vercel serverless environment
const feedbackFile = '/tmp/feedback.json';

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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await initializeFeedbackFile();

        if (req.method === 'POST') {
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
        } else if (req.method === 'GET') {
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
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 