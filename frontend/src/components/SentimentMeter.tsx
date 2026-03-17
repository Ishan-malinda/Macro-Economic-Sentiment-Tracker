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
      
      <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center mt-6">
        {/* SVG Semi-circle gauge */}
        <svg className="absolute bottom-0 w-64 h-64 overflow-visible" viewBox="0 0 100 100">
          {/* Background track */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            className="text-secondary opacity-50"
            strokeLinecap="round" 
          />
          {/* Progress track */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeDasharray="125.66" 
            strokeDashoffset={125.66 - (percentage / 100 * 125.66)} 
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${
              isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : 'text-blue-500 shadow-blue-500/50'
            }`} 
          />
        </svg>
        
        <div className="z-10 bg-background/90 px-6 py-2 rounded-t-2xl backdrop-blur-md border-x border-t border-border/50 shadow-lg">
          <span className={`text-4xl font-black tracking-tighter ${
            isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : 'text-blue-500'
          }`}>
            {label.toUpperCase()}
          </span>
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
