import React, { useState, useEffect, useCallback } from 'react';
import { CONFIGS, generateSudoku, validateBoard } from './utils/sudoku';
import { CellData, Difficulty } from './types';
import Board from './components/Board';
import Numpad from './components/Numpad';
import Timer from './components/Timer';
import WinModal from './components/WinModal';
import { RefreshCw, Trophy } from 'lucide-react';

type Language = 'en' | 'pl';

const TRANSLATIONS = {
  en: {
    title: 'Sudoku',
    difficulties: {
      [Difficulty.Easy]: 'Easy',
      [Difficulty.Medium]: 'Medium',
      [Difficulty.Hard]: 'Hard',
    },
    wonTitle: 'Game Won!',
    wonSubtitle: 'You are a Sudoku master.',
    timeLabel: 'Time Completed',
    newGame: 'New Game',
    footer: 'React Sudoku • Mobile Optimized',
    numpad: {
      title: 'Select a number',
      clear: 'Clear cell'
    }
  },
  pl: {
    title: 'Sudoku',
    difficulties: {
      [Difficulty.Easy]: 'Łatwy',
      [Difficulty.Medium]: 'Średni',
      [Difficulty.Hard]: 'Trudny',
    },
    wonTitle: 'Wygrana!',
    wonSubtitle: 'Jesteś mistrzem Sudoku.',
    timeLabel: 'Czas gry',
    newGame: 'Nowa Gra',
    footer: 'React Sudoku • Zoptymalizowane mobilnie',
    numpad: {
      title: 'Wybierz cyfrę',
      clear: 'Wyczyść pole'
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [lastModifiedCell, setLastModifiedCell] = useState<{ row: number, col: number } | null>(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const t = TRANSLATIONS[lang];

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const startNewGame = useCallback((diff: Difficulty) => {
    const config = CONFIGS[diff];
    const newGrid = generateSudoku(config);
    setGrid(newGrid);
    setDifficulty(diff);
    setIsPlaying(true);
    setGameWon(false);
    setSelectedCell(null);
    setIsMenuOpen(false);
    setSeconds(0);
    setLastModifiedCell(null);
  }, []);

  useEffect(() => {
    startNewGame(Difficulty.Easy);
  }, [startNewGame]);

  const handleCellClick = (row: number, col: number) => {
    if (!isPlaying || gameWon) return;
    
    // Always select the cell first
    setSelectedCell({ row, col });

    // Only open the menu if it's NOT an initial cell
    if (!grid[row][col].isInitial) {
      setIsMenuOpen(true);
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || !isPlaying || gameWon) return;
    const { row, col } = selectedCell;
    
    if (grid[row][col].isInitial) return;

    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = {
      ...newGrid[row][col],
      value: num
    };

    const config = CONFIGS[difficulty];
    const validatedGrid = validateBoard(newGrid, config.size, config.boxSize);
    setGrid(validatedGrid);
    
    // Animation trigger
    setLastModifiedCell({ row, col });
    setTimeout(() => setLastModifiedCell(null), 300); // Clear after animation

    // Close menu after selection for speed
    setIsMenuOpen(false);

    checkWinCondition(validatedGrid);
  };

  const handleDelete = () => {
    if (!selectedCell || !isPlaying || gameWon) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isInitial) return;

    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = {
      ...newGrid[row][col],
      value: null,
      isValid: true
    };
    
    const config = CONFIGS[difficulty];
    const validatedGrid = validateBoard(newGrid, config.size, config.boxSize);
    setGrid(validatedGrid);

    // Animation trigger for delete
    setLastModifiedCell({ row, col });
    setTimeout(() => setLastModifiedCell(null), 300);

    setIsMenuOpen(false);
  };

  const checkWinCondition = (currentGrid: CellData[][]) => {
    const isFull = currentGrid.every(row => row.every(cell => cell.value !== null));
    if (isFull) {
      const isCorrect = currentGrid.every(row => row.every(cell => cell.value === cell.solution));
      if (isCorrect) {
        setGameWon(true);
        setIsPlaying(false);
      }
    }
  };

  const config = CONFIGS[difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center py-6 px-4 font-sans selection:bg-indigo-200">
      
      {/* Win Modal */}
      {gameWon && (
        <WinModal 
          timeInSeconds={seconds}
          onNewGame={() => startNewGame(difficulty)}
          translations={{
            title: t.wonTitle,
            subtitle: t.wonSubtitle,
            button: t.newGame,
            timeLabel: t.timeLabel
          }}
        />
      )}

      {/* Header */}
      <header className="w-full max-w-[500px] flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-300">
            <Trophy size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{t.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/50 p-1.5 rounded-lg border border-white/50 backdrop-blur-sm">
             <button 
               onClick={() => setLang('pl')} 
               className={`text-2xl hover:scale-110 transition-transform ${lang === 'pl' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`}
               title="Polski"
             >
               🇵🇱
             </button>
             <button 
               onClick={() => setLang('en')} 
               className={`text-2xl hover:scale-110 transition-transform ${lang === 'en' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`}
               title="English"
             >
               🇺🇸
             </button>
          </div>
          <Timer seconds={seconds} />
        </div>
      </header>

      {/* Difficulty Tabs */}
      <div className="w-full max-w-[500px] bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white flex mb-8">
        {(Object.values(Difficulty) as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => startNewGame(level)}
            className={`
              flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${difficulty === level 
                ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'}
            `}
          >
            {t.difficulties[level]}
          </button>
        ))}
      </div>

      {/* Main Game Area */}
      <main className="flex flex-col items-center w-full relative z-0">
        
        {/* Board Container */}
        {grid.length > 0 && (
          <Board 
            grid={grid} 
            size={config.size} 
            boxSize={config.boxSize} 
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            difficulty={difficulty}
            lastModified={lastModifiedCell}
          />
        )}

        {/* Input Modal */}
        <Numpad 
          maxNum={config.size} 
          show={isMenuOpen}
          onNumberClick={handleNumberInput} 
          onDelete={handleDelete}
          onClose={() => setIsMenuOpen(false)}
          labels={t.numpad}
        />

        <button
          onClick={() => startNewGame(difficulty)}
          className="mt-10 flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl shadow-slate-400/50 hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
        >
          <RefreshCw size={22} />
          <span>{t.newGame}</span>
        </button>
      </main>
      
      <footer className="mt-auto pt-8 pb-4 text-slate-400 text-sm font-medium">
        {t.footer}
      </footer>
    </div>
  );
};

export default App;