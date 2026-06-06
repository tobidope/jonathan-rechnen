import type { AdditionTask, Level } from './types';

export const MAX_SUM = 1_000_000;

type LevelRule = {
  summands: 2 | 3 | 'mixed';
  maxExclusive: number;
  requireCarry: boolean;
  minimalCarries: boolean;
};

export const LEVEL_RULES: Record<Level, LevelRule> = {
  1: { summands: 2, maxExclusive: 100, requireCarry: false, minimalCarries: true },
  2: { summands: 2, maxExclusive: 1_000, requireCarry: true, minimalCarries: false },
  3: { summands: 2, maxExclusive: 10_000, requireCarry: true, minimalCarries: false },
  4: { summands: 3, maxExclusive: 10_000, requireCarry: true, minimalCarries: false },
  5: { summands: 'mixed', maxExclusive: 100_000, requireCarry: true, minimalCarries: false },
  6: { summands: 'mixed', maxExclusive: MAX_SUM, requireCarry: true, minimalCarries: false },
};

const randomInt = (minInclusive: number, maxInclusive: number) =>
  Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;

export const countCarryColumns = (addends: number[]) => {
  const sum = addends.reduce((total, value) => total + value, 0);
  const columns = Math.max(...addends, sum).toString().length;
  let carry = 0;
  let count = 0;

  for (let column = 0; column < columns; column += 1) {
    const columnSum =
      carry +
      addends.reduce((total, value) => total + Math.floor(value / 10 ** column) % 10, 0);
    carry = Math.floor(columnSum / 10);
    if (carry > 0) count += 1;
  }

  return count;
};

export const hasCarry = (addends: number[]) => countCarryColumns(addends) > 0;

const summandCountForLevel = (level: Level) => {
  const rule = LEVEL_RULES[level];
  if (rule.summands === 'mixed') return randomInt(2, 3);
  return rule.summands;
};

const createCandidate = (level: Level): number[] => {
  const rule = LEVEL_RULES[level];
  const count = summandCountForLevel(level);
  const maxSum = rule.maxExclusive - 1;
  const addends: number[] = [];
  let remaining = maxSum;

  for (let index = 0; index < count; index += 1) {
    const slotsLeft = count - index - 1;
    const minForRest = slotsLeft;
    const maxForThis = Math.max(1, remaining - minForRest);
    const value = index === count - 1 ? remaining : randomInt(1, maxForThis);
    addends.push(value);
    remaining -= value;
  }

  const targetSum = randomInt(count, maxSum);
  let scale = targetSum / addends.reduce((total, value) => total + value, 0);
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;

  const scaled = addends.map((value) => Math.max(1, Math.floor(value * scale)));
  let diff = targetSum - scaled.reduce((total, value) => total + value, 0);
  let cursor = 0;
  while (diff > 0) {
    scaled[cursor % scaled.length] += 1;
    diff -= 1;
    cursor += 1;
  }

  return scaled.sort((a, b) => b - a);
};

const isValidForLevel = (level: Level, addends: number[]) => {
  const rule = LEVEL_RULES[level];
  const sum = addends.reduce((total, value) => total + value, 0);
  const carries = countCarryColumns(addends);

  if (sum >= rule.maxExclusive || sum >= MAX_SUM) return false;
  if (addends.length < 2 || addends.length > 3) return false;
  if (rule.summands !== 'mixed' && addends.length !== rule.summands) return false;
  if (rule.requireCarry && carries === 0) return false;
  if (rule.minimalCarries && carries > 1) return false;
  return true;
};

export const generateTask = (level: Level): AdditionTask => {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const addends = createCandidate(level);
    if (!isValidForLevel(level, addends)) continue;

    const sum = addends.reduce((total, value) => total + value, 0);
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      level,
      addends,
      sum,
      columns: sum.toString().length,
    };
  }

  const fallback: Record<Level, number[]> = {
    1: [34, 25],
    2: [487, 258],
    3: [4_875, 2_468],
    4: [3_421, 2_358, 1_906],
    5: [48_705, 23_168, 9_420],
    6: [487_305, 258_416],
  };
  const addends = fallback[level];
  const sum = addends.reduce((total, value) => total + value, 0);
  return {
    id: `${Date.now()}-fallback-${level}`,
    level,
    addends,
    sum,
    columns: sum.toString().length,
  };
};
