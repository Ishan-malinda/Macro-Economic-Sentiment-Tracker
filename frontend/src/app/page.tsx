"use client";

import { useEffect, useState } from "react";
import SentimentMeter from "@/components/SentimentMeter";
import EventsTable from "@/components/EventsTable";

interface Event {
  id: number;
  event_time: string;
  currency: string;
  event_name: string;
  impact: string;
  actual: string;
  forecast: string;
  sentiment_flag: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sentiment, setSentiment] = useState({ score: 0, label: "Neutral" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Next.js requires public variables to start with NEXT_PUBLIC_
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const eventsResponse = await fetch(`${API_URL}/api/events/today`);

        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        const sentimentResponse = await fetch(`${API_URL}/api/sentiment/daily`);
        const sentimentData = await sentimentResponse.json();
        setSentiment(sentimentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
            Macro Sentiment
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Real-time economic calendar & market score tracker.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary/30 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-green-500/80">Live Pipeline Active</span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-1 h-full">
          <SentimentMeter score={sentiment.score} label={sentiment.label} />
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col justify-center border border-white/5">
          <h3 className="text-xl font-bold mb-4">Market Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            The sentiment score is calculated by analyzing "High Impact" events and comparing the actual release numbers
            against the consensus forecasts. A <span className="text-green-400 font-bold">Bullish</span> score indicates economic
            data is performing better than expected, while a <span className="text-red-400 font-bold">Bearish</span> score suggests
            underperformance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-muted-foreground uppercase mb-1">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-muted-foreground uppercase mb-1">High Impact</p>
              <p className="text-2xl font-bold text-red-400">
                {events.filter(e => e.impact === 'High').length}
              </p>
            </div>
            {/* Add more stats if needed */}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight">Daily Data Releases</h2>
          <span className="text-xs text-muted-foreground font-mono">UTC Timezone</span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <EventsTable events={events} />
        )}
      </section>

      <footer className="pt-12 text-center text-xs text-muted-foreground border-t border-border/50">
        <p>© 2026 Macro-Economic Sentiment Tracker. For interview demonstration purposes.</p>
      </footer>
    </main>
  );
}
