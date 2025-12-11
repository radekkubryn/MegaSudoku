import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { formatTime } from './Timer';

interface WinModalProps {
  timeInSeconds: number;
  onNewGame: () => void;
  translations: {
    title: string;
    subtitle: string;
    button: string;
    timeLabel: string;
  };
}

const WinModal: React.FC<WinModalProps> = ({ timeInSeconds, onNewGame, translations }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center text-center animate-scale-in border-4 border-indigo-100">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200 mb-6 animate-bounce">
          <Trophy size={40} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{translations.title}</h2>
        <p className="text-slate-500 mb-6">{translations.subtitle}</p>
        
        <div className="bg-slate-50 rounded-xl p-4 w-full mb-8 border border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{translations.timeLabel}</p>
          <p className="text-3xl font-mono font-bold text-indigo-600">{formatTime(timeInSeconds)}</p>
        </div>

        <button
          onClick={onNewGame}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-300 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          {translations.button}
        </button>
      </div>
    </div>
  );
};

export default WinModal;