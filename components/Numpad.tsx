import React from 'react';
import { Eraser, X } from 'lucide-react';

interface NumpadProps {
  maxNum: number;
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  onClose: () => void;
  show: boolean;
  labels: {
    title: string;
    clear: string;
  };
}

const Numpad: React.FC<NumpadProps> = ({ maxNum, onNumberClick, onDelete, onClose, show, labels }) => {
  if (!show) return null;

  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-fade-in"
      onClick={(e) => {
        // Close if clicked on the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-[340px] animate-scale-in border border-white/50 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">{labels.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              className="
                aspect-[1.2] rounded-2xl 
                bg-gradient-to-b from-white to-slate-50
                border border-slate-200 shadow-[0_4px_0_0_rgba(203,213,225,1)]
                text-3xl font-bold text-indigo-600
                active:shadow-none active:translate-y-[4px] active:border-t-4 active:border-t-transparent
                transition-all
              "
            >
              {num}
            </button>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="mt-6">
          <button
            onClick={onDelete}
            className="
              w-full py-4 rounded-2xl
              bg-rose-50 border border-rose-200 text-rose-600 font-semibold
              flex items-center justify-center gap-2
              hover:bg-rose-100 transition-colors
              active:scale-95
            "
          >
            <Eraser size={20} />
            <span>{labels.clear}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Numpad;