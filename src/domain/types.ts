export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type AdditionTask = {
  id: string;
  level: Level;
  addends: number[];
  sum: number;
  columns: number;
};

export type ColumnCheck = {
  columnIndex: number;
  expectedDigit: number;
  expectedCarryOut: number;
  correct: boolean;
};

export type TaskAttempt = {
  id: string;
  level: Level;
  addends: number[];
  sum: number;
  solvedAt: string;
  mistakes: number;
};

export type MistakeStats = Record<string, number>;

export type ProgressState = {
  currentLevel: Level;
  totalSolved: number;
  stars: number;
  streak: number;
  bestStreak: number;
  dailySolvedDate: string;
  dailySolvedCount: number;
  badges: string[];
  recentTaskHistory: TaskAttempt[];
  mistakeStatsByColumn: MistakeStats;
  successRunAtLevel: number;
};

export type Badge = {
  id: string;
  label: string;
  description: string;
};
