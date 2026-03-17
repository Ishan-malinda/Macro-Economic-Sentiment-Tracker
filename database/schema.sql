CREATE TABLE IF NOT EXISTS economic_events (
    id SERIAL PRIMARY KEY,
    event_date DATE DEFAULT CURRENT_DATE,
    event_time TEXT,
    currency VARCHAR(10),
    event_name TEXT,
    impact VARCHAR(20),
    actual TEXT,
    forecast TEXT,
    actual_num NUMERIC,
    forecast_num NUMERIC,
    sentiment_flag INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on current date
CREATE INDEX IF NOT EXISTS idx_event_date ON economic_events(event_date);
