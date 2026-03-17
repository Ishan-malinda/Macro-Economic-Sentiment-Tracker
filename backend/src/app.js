const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const supabase = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// GET /api/events/today: Fetches all events for the current date
app.get('/api/events/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('economic_events')
            .select('*')
            .eq('event_date', today)
            .order('event_time', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/sentiment/daily: Aggregates sentiment for high-impact events
app.get('/api/sentiment/daily', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('economic_events')
            .select('sentiment_flag')
            .eq('event_date', today)
            .eq('impact', 'High');

        if (error) throw error;

        const totalSentiment = data.reduce((acc, curr) => acc + curr.sentiment_flag, 0);
        
        let sentimentLabel = 'Neutral';
        if (totalSentiment > 0) sentimentLabel = 'Bullish';
        else if (totalSentiment < 0) sentimentLabel = 'Bearish';

        res.json({
            score: totalSentiment,
            label: sentimentLabel,
            eventCount: data.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
