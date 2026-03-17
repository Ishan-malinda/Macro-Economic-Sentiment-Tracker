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
      
      <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
        {/* Semi-circle gauge */}
        <div className="absolute w-64 h-64 border-[16px] border-secondary rounded-full bottom-0" />
        <div 
          className={`absolute w-64 h-64 border-[16px] rounded-full bottom-0 transition-all duration-1000 ease-out ${
            isBullish ? 'border-green-500' : isBearish ? 'border-red-500' : 'border-blue-500'
          }`}
          style={{ 
            clipPath: 'inset(50% 0 0 0)',
            transform: `rotate(${(percentage * 1.8) - 90}deg)`,
            opacity: 0.8
          }}
        />
        
        <div className="z-10 bg-background/80 px-4 py-2 rounded-t-xl backdrop-blur-sm border-x border-t border-border">
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
