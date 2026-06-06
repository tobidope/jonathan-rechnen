import { describe, expect, it } from 'vitest';
import { carryIntoColumn, carryRowDigits, checkColumn, expectedForColumn, isTaskSolved } from './columnChecker';
import type { AdditionTask } from './types';

const task: AdditionTask = {
  id: 'fixed',
  level: 3,
  addends: [487, 258],
  sum: 745,
  columns: 3,
};

describe('column checking', () => {
  it('checks from right to left with carry handling', () => {
    expect(expectedForColumn(task, 0, 0)).toEqual({ expectedDigit: 5, expectedCarryOut: 1 });
    expect(carryIntoColumn(task, 1)).toBe(1);
    expect(checkColumn(task, 1, 4)).toMatchObject({ correct: true, expectedCarryOut: 1 });
    expect(checkColumn(task, 2, 7)).toMatchObject({ correct: true, expectedCarryOut: 0 });
  });

  it('rejects a wrong digit and accepts the corrected retry', () => {
    expect(checkColumn(task, 0, 4).correct).toBe(false);
    expect(checkColumn(task, 0, 5).correct).toBe(true);
  });

  it('exposes carry row digits for the written layout', () => {
    expect(carryRowDigits(task)).toEqual([1, 1, null]);
  });

  it('knows when the result row is complete', () => {
    expect(isTaskSolved(task, [5, 4, 7])).toBe(true);
    expect(isTaskSolved(task, [5, 3, 7])).toBe(false);
  });
});
