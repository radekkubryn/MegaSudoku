import { CellData, GameConfig, Difficulty } from '../types';

export const CONFIGS: Record<Difficulty, GameConfig> = {
  // All levels are now 9x9 (size: 9, boxSize: 3)
  [Difficulty.Easy]: { size: 9, boxSize: 3, difficulty: Difficulty.Easy, emptyCells: 30 },
  [Difficulty.Medium]: { size: 9, boxSize: 3, difficulty: Difficulty.Medium, emptyCells: 40 },
  [Difficulty.Hard]: { size: 9, boxSize: 3, difficulty: Difficulty.Hard, emptyCells: 50 },
};

// Check if it's safe to put num at board[row][col]
export const isSafe = (
  board: (number | null)[][],
  row: number,
  col: number,
  num: number,
  size: number,
  boxSize: number
): boolean => {
  // Check Row
  for (let x = 0; x < size; x++) {
    if (x !== col && board[row][x] === num) return false;
  }

  // Check Col
  for (let x = 0; x < size; x++) {
    if (x !== row && board[x][col] === num) return false;
  }

  // Check Box
  const startRow = row - (row % boxSize);
  const startCol = col - (col % boxSize);
  for (let i = 0; i < boxSize; i++) {
    for (let j = 0; j < boxSize; j++) {
      const r = i + startRow;
      const c = j + startCol;
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
};

// Generator Class
class SudokuGenerator {
  size: number;
  boxSize: number;
  board: number[][];

  constructor(size: number, boxSize: number) {
    this.size = size;
    this.boxSize = boxSize;
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
  }

  fillValues(): void {
    // Fill diagonal boxes first (they are independent)
    for (let i = 0; i < this.size; i = i + this.boxSize) {
      this.fillBox(i, i);
    }
    // Fill remaining blocks
    this.fillRemaining(0, this.boxSize);
  }

  fillBox(row: number, col: number): void {
    let num: number;
    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        do {
          num = Math.floor(Math.random() * this.size) + 1;
        } while (!this.isSafeBox(row, col, num));
        this.board[row + i][col + j] = num;
      }
    }
  }

  isSafeBox(rowStart: number, colStart: number, num: number): boolean {
    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        if (this.board[rowStart + i][colStart + j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  checkIfSafe(i: number, j: number, num: number): boolean {
    return (
      this.unUsedInRow(i, num) &&
      this.unUsedInCol(j, num) &&
      this.unUsedInBox(i - (i % this.boxSize), j - (j % this.boxSize), num)
    );
  }

  unUsedInRow(i: number, num: number): boolean {
    for (let j = 0; j < this.size; j++) {
      if (this.board[i][j] === num) return false;
    }
    return true;
  }

  unUsedInCol(j: number, num: number): boolean {
    for (let i = 0; i < this.size; i++) {
      if (this.board[i][j] === num) return false;
    }
    return true;
  }

  unUsedInBox(rowStart: number, colStart: number, num: number): boolean {
    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        if (this.board[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  }

  fillRemaining(i: number, j: number): boolean {
    if (j >= this.size && i < this.size - 1) {
      i = i + 1;
      j = 0;
    }
    if (i >= this.size && j >= this.size) return true;

    if (i < this.boxSize) {
      if (j < this.boxSize) j = this.boxSize;
    } else if (i < this.size - this.boxSize) {
      if (j === Math.floor(i / this.boxSize) * this.boxSize) {
        j = j + this.boxSize;
      }
    } else {
      if (j === this.size - this.boxSize) {
        i = i + 1;
        j = 0;
        if (i >= this.size) return true;
      }
    }

    for (let num = 1; num <= this.size; num++) {
      if (this.checkIfSafe(i, j, num)) {
        this.board[i][j] = num;
        if (this.fillRemaining(i, j + 1)) return true;
        this.board[i][j] = 0;
      }
    }
    return false;
  }
}

export const generateSudoku = (config: GameConfig): CellData[][] => {
  const { size, boxSize, emptyCells } = config;
  const generator = new SudokuGenerator(size, boxSize);
  generator.fillValues();
  
  const solution = generator.board.map(row => [...row]);
  const puzzle = generator.board.map(row => [...row]);

  // Remove K digits
  let count = emptyCells;
  while (count > 0) {
    const cellId = Math.floor(Math.random() * (size * size));
    const i = Math.floor(cellId / size);
    const j = cellId % size;
    if (puzzle[i][j] !== 0) {
      count--;
      puzzle[i][j] = 0;
    }
  }

  // Create CellData structure
  const cells: CellData[][] = [];
  for (let r = 0; r < size; r++) {
    const rowCells: CellData[] = [];
    for (let c = 0; c < size; c++) {
      const val = puzzle[r][c];
      rowCells.push({
        row: r,
        col: c,
        value: val === 0 ? null : val,
        solution: solution[r][c],
        isInitial: val !== 0,
        isValid: true
      });
    }
    cells.push(rowCells);
  }
  return cells;
};

export const validateBoard = (board: CellData[][], size: number, boxSize: number): CellData[][] => {
  // We need a lightweight representation to check 'isSafe'
  const tempBoard = board.map(row => row.map(c => c.value));
  
  return board.map((row, rIdx) => 
    row.map((cell, cIdx) => {
      if (!cell.value) return { ...cell, isValid: true };
      
      // If it's initial, it's always "valid" in terms of game rules (or assumed valid)
      if (cell.isInitial) return { ...cell, isValid: true };

      // Check against game rules (duplicates in row/col/box)
      // Note: isSafe checks if *other* cells conflict. 
      // We must temporarily empty this cell to check strictly if it CAN exist there.
      const currentVal = cell.value;
      tempBoard[rIdx][cIdx] = null; // Remove self
      const valid = isSafe(tempBoard, rIdx, cIdx, currentVal, size, boxSize);
      tempBoard[rIdx][cIdx] = currentVal; // Restore self
      
      return { ...cell, isValid: valid };
    })
  );
};