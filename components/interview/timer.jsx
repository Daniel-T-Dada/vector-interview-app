'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function Timer({ duration = 60, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  
  useEffect(() => {
    // Reset timer when duration changes
    setSecondsLeft(duration);
    
    // Create interval to count down
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        // If time is up, clear interval and call the onTimeUp callback
        if (prevSeconds <= 1) {
          clearInterval(intervalId);
          onTimeUp && onTimeUp();
          return 0;
        }
        
        return prevSeconds - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [duration, onTimeUp]);
  
  // Format seconds to MM:SS display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
 
  const percentage = (secondsLeft / duration) * 100;
  
  // We need to add different colors to th timer to make the condidate know when they are running out of time - Oya sope otilo
  let colorClass = 'text-green-500';
  if (percentage < 30) {
    colorClass = 'text-red-500';
  } else if (percentage < 60) {
    colorClass = 'text-amber-500';
  }
  
  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${colorClass}`} />
      <span className={`font-mono font-bold ${colorClass}`}>
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
} 