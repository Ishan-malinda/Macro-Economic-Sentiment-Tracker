# 📈 Macro-Economic Sentiment Tracker

A fully automated, four-tier data pipeline that scrapes high-impact economic data, calculates live market sentiment, and displays it on a premium financial dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-green.svg)
![Node.js](https://img.shields.io/badge/node.js-20%2B-brightgreen.svg)
![Next.js](https://img.shields.io/badge/next.js-14%2B-black.svg)

## 🌟 The Core Problem
Financial markets react violently to scheduled macroeconomic data releases (CPI, Interest Rates, Employment numbers). Traders need to know not just what the number is, but whether it was better or worse than forecasted to gauge market direction.

## 🚀 The Solution: 4-Tier Pipeline

### 🏗️ Tier 1: Automation Engine (Python + Playwright)
- **Headless Scraper**: Automatically navigates to economic calendars (Investing.com).
- **Data Normalization**: Cleans raw web text (e.g., "250K" → 250,000) for mathematical processing.
- **Sentiment Logic**: Calculates a `sentiment_flag` (-1 Bearish, 0 Neutral, 1 Bullish) by comparing "Actual" vs. "Forecast" results.

### 🗄️ Tier 2: Data Vault (PostgreSQL via Supabase)
- **Centralized Storage**: Stores all economic events with precise timestamps and impact levels.
- **Indexed Queries**: Optimized for real-time retrieval of the current day's events.

### 🔌 Tier 3: API Layer (Node.js + Express)
- **Secure Bridge**: Expose cleaned data to the frontend without direct database access.
- **Aggregation Endpoints**: 
    - `GET /api/events/today`: List all scheduled/released events.
    - `GET /api/sentiment/daily`: Calculates the "Market Score" based on high-impact events.

### 💻 Tier 4: Client Dashboard (Next.js + Tailwind CSS)
- **Financial UI**: A modern, dark-mode dashboard with glassmorphism aesthetics.
- **Live Sentiment Meter**: A visual gauge showing the prevailing market mood.
- **Responsive Data Table**: Real-time status of data releases with sentiment-based color coding.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 20+
- Supabase Account (PostgreSQL)

### 2. Scraper Setup
```bash
cd scraper
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
playwright install chromium
```

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧠 Architectural Talking Points (Interview Flex)
- **Separation of Concerns**: Demonstrates a modular microservices-style architecture.
- **Headless Execution**: The scraper is designed to run silently in the background via Cron/Task Scheduler.
- **Data Cleaning**: Solves the challenge of scraping inconsistent web text and converting it into "math-ready" integers.

Live Site - https://macro-economic-sentiment-tracker.vercel.app/
---
Built with  by [Ishan Malinda](https://github.com/Ishan-malinda)
