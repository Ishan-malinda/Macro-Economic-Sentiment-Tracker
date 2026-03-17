import React from 'react';

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

interface EventsTableProps {
  events: Event[];
}

const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
  return (
    <div className="w-full glass rounded-2xl overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Time</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Cur.</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Event</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Impact</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Actual</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Forecast</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground bg-black/20">
                  No events found for today. The tracker might be updating...
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-blue-400">{event.event_time}</td>
                  <td className="px-6 py-4 font-bold text-sm tracking-wide">{event.currency}</td>
                  <td className="px-6 py-4 text-sm font-medium">{event.event_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      event.impact === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      event.impact === 'Medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {event.impact}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${
                    event.sentiment_flag === 1 ? 'text-green-500' :
                    event.sentiment_flag === -1 ? 'text-red-500' :
                    'text-foreground'
                  }`}>
                    {event.actual || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground text-right">{event.forecast || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
