import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
}

export const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  return (
    <div className="flex items-center gap-2 text-slate-700 font-mono text-xl bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
      <Clock size={20} className="text-blue-500" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;