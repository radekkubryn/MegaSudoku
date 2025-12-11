export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export interface CellData {
  row: number;
  col: number;
  value: number | null; // The current value displayed (0 or null means empty)
  solution: number; // The correct value
  isInitial: boolean; // Was this provided at the start?
  isValid: boolean; // Does it conflict with row/col/box currently?
}

export interface GameConfig {
  size: number; // 9 or 16
  boxSize: number; // 3 or 4
  difficulty: Difficulty;
  emptyCells: number;
}