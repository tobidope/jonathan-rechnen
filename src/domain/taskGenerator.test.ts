import { describe, expect, it } from 'vitest';
import { countCarryColumns, generateTask, LEVEL_RULES, MAX_SUM } from './taskGenerator';
import type { Level } from './types';

const levels: Level[] = [1, 2, 3, 4, 5, 6];

describe('generateTask', () => {
  it('keeps every generated sum below one million', () => {
    for (const level of levels) {
      for (let index = 0; index < 120; index += 1) {
        const task = generateTask(level);
        expect(task.sum).toBeLessThan(MAX_SUM);
      }
    }
  });

  it('honors level sum limits and summand counts', () => {
    for (const level of levels) {
      for (let index = 0; index < 80; index += 1) {
        const task = generateTask(level);
        const rule = LEVEL_RULES[level];
        expect(task.sum).toBeLessThan(rule.maxExclusive);
        expect(task.addends.length).toBeGreaterThanOrEqual(2);
        expect(task.addends.length).toBeLessThanOrEqual(3);

        if (rule.summands !== 'mixed') {
          expect(task.addends).toHaveLength(rule.summands);
        }
      }
    }
  });

  it('adds carries for levels that require them', () => {
    for (const level of [2, 3, 4, 5, 6] as Level[]) {
      for (let index = 0; index < 50; index += 1) {
        expect(countCarryColumns(generateTask(level).addends)).toBeGreaterThan(0);
      }
    }
  });

  it('keeps level 1 small with at most one carry column', () => {
    for (let index = 0; index < 80; index += 1) {
      const task = generateTask(1);
      expect(task.addends).toHaveLength(2);
      expect(task.sum).toBeLessThan(100);
      expect(countCarryColumns(task.addends)).toBeLessThanOrEqual(1);
    }
  });
});
