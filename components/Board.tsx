import React from 'react';
import { CellData, Difficulty } from '../types';

interface BoardProps {
  grid: CellData[][];
  size: number;
  boxSize: number;
  selectedCell: { row: number, col: number } | null;
  onCellClick: (row: number, col: number) => void;
  difficulty: Difficulty;
  lastModified: { row: number, col: number } | null;
}

const Board: React.FC<BoardProps> = ({ grid, size, boxSize, selectedCell, onCellClick, difficulty, lastModified }) => {
  return (
    <div className="w-full max-w-[500px] p-3 rounded-3xl bg-white shadow-xl shadow-indigo-100 border border-indigo-50">
      <div 
        className="grid grid-cols-9 w-full aspect-square bg-slate-200 border-2 border-slate-800 rounded-lg overflow-hidden"
      >
        {grid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
            const isLastModified = lastModified?.row === rIdx && lastModified?.col === cIdx;
            
            // Determine borders for Box visualization
            const isRightBorder = (cIdx + 1) % boxSize === 0 && cIdx !== size - 1;
            const isBottomBorder = (rIdx + 1) % boxSize === 0 && rIdx !== size - 1;

            // 1. Calculate Relationship (Row/Col/Box)
            let isRelated = false;
            if (selectedCell) {
                const sRow = selectedCell.row;
                const sCol = selectedCell.col;
                const inRow = rIdx === sRow;
                const inCol = cIdx === sCol;
                const inBox = 
                    Math.floor(rIdx / boxSize) === Math.floor(sRow / boxSize) && 
                    Math.floor(cIdx / boxSize) === Math.floor(sCol / boxSize);
                
                if (inRow || inCol || inBox) {
                    isRelated = true;
                }
            }

            // 2. Conflict Detection (Only if NOT Hard)
            let isConflict = false;
            if (difficulty !== Difficulty.Hard && selectedCell && grid[selectedCell.row][selectedCell.col].value !== null) {
               const sRow = selectedCell.row;
               const sCol = selectedCell.col;
               const sVal = grid[sRow][sCol].value;

               // If current cell has same value as selected cell, but is not the selected cell itself
               if (cell.value === sVal && (rIdx !== sRow || cIdx !== sCol)) {
                   const inRow = rIdx === sRow;
                   const inCol = cIdx === sCol;
                   const inBox = 
                      Math.floor(rIdx / boxSize) === Math.floor(sRow / boxSize) && 
                      Math.floor(cIdx / boxSize) === Math.floor(sCol / boxSize);
                   
                   if (inRow || inCol || inBox) {
                       isConflict = true;
                   }
               }
            }

            // 3. Same Number Detection
            let isSameNumber = false;
            if (!isSelected && !isConflict && selectedCell && grid[selectedCell.row][selectedCell.col].value !== null) {
               const selectedVal = grid[selectedCell.row][selectedCell.col].value;
               if (cell.value === selectedVal) {
                  isSameNumber = true;
               }
            }

            // 4. Styling Logic
            let bgColor = 'bg-white';
            let textColor = 'text-slate-700';
            
            // Base styles
            if (cell.isInitial) {
              bgColor = 'bg-slate-100'; // Initial cells slightly darker
              textColor = 'text-slate-900 font-bold';
            } else if (cell.value !== null) {
              textColor = 'text-indigo-600 font-bold'; // User filled cells
            }

            // Contextual Overrides (Lowest to Highest Priority)
            
            // Level 1: Related (Row/Col/Box)
            if (isRelated && !isSelected) {
               bgColor = 'bg-indigo-50';
            }

            // Level 2: Same Number
            if (isSameNumber) {
              bgColor = 'bg-indigo-200';
            }
            
            // Level 3: Error States
            if (cell.value !== null && !cell.isValid && !cell.isInitial) {
              // Invalid cell (self)
              bgColor = 'bg-rose-100';
              textColor = 'text-rose-600 font-bold';
            } 
            
            if (isConflict) {
               // Conflict source highlight (pink/red)
               bgColor = 'bg-rose-300';
               textColor = 'text-rose-900 font-bold';
            }

            // Level 4: Selection (Highest Priority)
            if (isSelected) {
               // If selected cell is invalid, use red background, otherwise indigo
               if (!cell.isValid && !cell.isInitial && cell.value !== null) {
                 bgColor = 'bg-rose-500';
               } else {
                 bgColor = 'bg-indigo-500';
               }
               textColor = 'text-white font-bold';
            }

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => onCellClick(rIdx, cIdx)}
                className={`
                  relative flex items-center justify-center 
                  cursor-pointer transition-colors duration-100
                  ${bgColor}
                  ${textColor}
                  ${isLastModified ? 'animate-pop z-10' : ''}
                  text-xl sm:text-3xl select-none
                  ${isRightBorder ? 'border-r-2 border-r-slate-800' : 'border-r border-r-slate-300'}
                  ${isBottomBorder ? 'border-b-2 border-b-slate-800' : 'border-b border-b-slate-300'}
                  active:bg-indigo-200
                `}
              >
                {cell.value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;