# Implementation Plan - Macro-Economic Sentiment Tracker

This plan outlines the four-tier data pipeline for tracking macro-economic sentiment.

## Proposed Changes

### Project Structure
- [NEW] `/scraper`: Python project for Playwright automation.
- [NEW] `/backend`: Node.js/Express API.
- [NEW] `/frontend`: Next.js dashboard.
- [NEW] `/database`: SQL schema and initialization scripts.

---

### Tier 1: Automation Engine (Python + Playwright)
- **Goal**: Scrape economic calendar data.
- **Target**: `https://www.investing.com/economic-calendar/` (or similar).
- **Files**:
    - [NEW] `scraper/main.py`: Main scraping logic.
    - [NEW] `scraper/requirements.txt`: Python dependencies.
    - [NEW] `scraper/utils/cleaner.py`: Data normalization utilities.

---

### Tier 2: Data Vault (PostgreSQL)
- **Goal**: Store events and calculate sentiment.
- **Table**: `economic_events`
- **Columns**: `id`, `event_date`, `currency`, `event_name`, `impact` (Low/Medium/High), `forecast`, `actual`, `sentiment_flag` (-1/0/1).

---

### Tier 3: API Layer (Node.js + Express)
- **Goal**: Securely expose data to the frontend.
- **Endpoints**:
    - `GET /api/events/today`: Daily events.
    - `GET /api/sentiment/daily`: Aggregate bullish/bearish score.

---

### Tier 4: Client Dashboard (Next.js + Tailwind CSS)
- **Goal**: Premium dark-mode financial dashboard.
- **Components**:
    - `SentimentMeter`: Visual indicator of market mood.
    - `EventsTable`: Detailed list of released data.

## Verification Plan

### Automated Tests
- Python: Test scraping logic against mock HTML.
- Node.js: Jest tests for API routes.
- Frontend: Playwright tests for UI components.

### Manual Verification
- Verify terminal output of scraper.
- Check PostgreSQL table populated correctly.
- Verify dashboard reflects real-time scores.
