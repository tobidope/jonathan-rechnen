import { describe, expect, it } from 'vitest';
import { DAILY_GOAL, defaultProgress, recordSolvedTask, SUCCESS_RUN_TO_LEVEL_UP } from './progress';
import type { AdditionTask } from './types';

const task: AdditionTask = {
  id: 'progress-task',
  level: 1,
  addends: [12, 23],
  sum: 35,
  columns: 2,
};

describe('progression', () => {
  it('records solved tasks, stars, streaks, history, and badges', () => {
    const next = recordSolvedTask(defaultProgress(), task, {});
    expect(next.totalSolved).toBe(1);
    expect(next.stars).toBe(4);
    expect(next.streak).toBe(1);
    expect(next.bestStreak).toBe(1);
    expect(next.recentTaskHistory).toHaveLength(1);
    expect(next.badges).toContain('first_launch');
  });

  it('levels up after a small clean run', () => {
    let progress = defaultProgress();
    for (let index = 0; index < SUCCESS_RUN_TO_LEVEL_UP; index += 1) {
      progress = recordSolvedTask(progress, task, {});
    }
    expect(progress.currentLevel).toBe(2);
    expect(progress.successRunAtLevel).toBe(0);
  });

  it('does not let a corrected mistake block forever, but resets clean-run progress', () => {
    let progress = defaultProgress();
    progress = recordSolvedTask(progress, task, {});
    progress = recordSolvedTask(progress, task, { 0: 1 });
    expect(progress.totalSolved).toBe(2);
    expect(progress.streak).toBe(0);
    expect(progress.bestStreak).toBe(1);
    expect(progress.currentLevel).toBe(1);
    expect(progress.successRunAtLevel).toBe(0);
    expect(progress.mistakeStatsByColumn['0']).toBe(1);
  });

  it('awards the daily goal badge', () => {
    let progress = defaultProgress();
    for (let index = 0; index < DAILY_GOAL; index += 1) {
      progress = recordSolvedTask(progress, task, {});
    }
    expect(progress.dailySolvedCount).toBe(DAILY_GOAL);
    expect(progress.badges).toContain('daily_goal');
  });
});
