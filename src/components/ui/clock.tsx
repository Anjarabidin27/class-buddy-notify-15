import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface RealtimeClockProps {
  className?: string;
}

export function RealtimeClock({ className = "" }: RealtimeClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`text-right ${className}`}>
      <div className="text-lg font-bold">
        {formatTime(currentTime)}
      </div>
      <div className="text-xs opacity-70">
        {formatDate(currentTime)}
      </div>
    </div>
  );
}