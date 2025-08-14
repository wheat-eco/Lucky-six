"use client"

import { useState, useEffect } from 'react';

export function Countdown() {
  const [targetDate, setTargetDate] = useState(new Date("2025-08-19T12:00:00Z").getTime());
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isElapsed, setIsElapsed] = useState(false);

  useEffect(() => {
    // Set initial value
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      setIsElapsed(true);
    } else {
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setIsElapsed(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isElapsed) {
    return <div className="text-3xl md:text-5xl font-headline font-bold text-amber-300 animate-in fade-in duration-1000">Launching Now!</div>;
  }
  
  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 my-8">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center justify-center rounded-lg bg-black/20 p-2 md:p-5 w-[65px] md:w-[100px] border border-white/10 shadow-lg">
          <div className="text-2xl md:text-6xl font-headline font-normal text-amber-300 tracking-tighter">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-[10px] md:text-sm font-body text-muted-foreground uppercase tracking-widest">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
