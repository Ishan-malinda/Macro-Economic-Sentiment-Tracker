"use client";

import React from 'react';

interface SentimentMeterProps {
  score: number;
  label: string;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ score, label }) => {
  const isBullish = label === 'Bullish';
  const isBearish = label === 'Bearish';
  
  // Calculate percentage for a gauge (0 to 100, where 50 is neutral)
  // Assuming score ranges from -5 to 5 for high impact events
  const percentage = Math.min(Math.max(((score + 5) / 10) * 100, 0), 100);

  return (
    <div className="flex flex-col items-center justify-center p-8 glass rounded-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-gray-500 to-green-500 opacity-30" />
      
      <h2 className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-widest">Market Sentiment</h2>
      
      <div className="relative w-64 h-32 overflow-hidden flex flex-col justify-end mt-4">
        {/* Background track (half circle) */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] border-secondary" />

        {/* Foreground track (moving part) */}
        <div 
          className={`absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] transition-transform duration-1000 ease-out origin-center ${
            isBullish ? 'border-green-500 border-b-transparent border-l-transparent' : 
            isBearish ? 'border-red-500 border-b-transparent border-l-transparent' : 
            'border-blue-500 border-b-transparent border-l-transparent'
          }`}
          style={{ 
            /* 
              This rotates a quarter-circle.
              percentage 0% = rotate(-45deg) (hidden on the left)
              percentage 50% = rotate(45deg) (pointing straight up)
              percentage 100% = rotate(135deg) (fully visible on the right)
            */
            transform: `rotate(${ -45 + (percentage * 1.8)}deg)` 
          }}
        />
        
        {/* Inner Label Container */}
        <div className="flex flex-col items-center z-10 w-full mb-[-1px]">
          <div className="bg-background/95 w-48 py-2 rounded-t-2xl border-x border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex justify-center">
             <span className={`text-4xl font-black tracking-tighter ${
                isBullish ? 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                isBearish ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              }`}>
                {label.toUpperCase()}
              </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-foreground/80 font-semibold text-lg">
          Score: <span className={score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : ''}>{score > 0 ? `+${score}` : score}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Based on high-impact macro data releases scheduled for today.
        </p>
      </div>
    </div>
  );
};

export default SentimentMeter;
