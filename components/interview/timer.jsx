'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export function Timer({ duration = 60, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  const timerIdRef = useRef(null);
  const isTimeUpCalled = useRef(false);
  
  // Update the ref when onTimeUp changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);
  
  useEffect(() => {
    // Reset timer when duration changes
    setSecondsLeft(duration);
    isTimeUpCalled.current = false;
    
    // Create interval to count down
    timerIdRef.current = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        // If time is up, clear interval and call the onTimeUp callback
        if (prevSeconds <= 1) {
          clearInterval(timerIdRef.current);
          
          // Use setTimeout to avoid setState during render
          if (!isTimeUpCalled.current) {
            isTimeUpCalled.current = true;
            setTimeout(() => {
              if (onTimeUpRef.current) {
                onTimeUpRef.current();
              }
            }, 0);
          }
          
          return 0;
        }
        
        return prevSeconds - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [duration]); // Remove onTimeUp from dependency array
  
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