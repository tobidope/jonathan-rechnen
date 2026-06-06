import type { AdditionTask, ColumnCheck } from './types';

export const digitAtColumn = (value: number, columnIndex: number) =>
  Math.floor(value / 10 ** columnIndex) % 10;

export const expectedForColumn = (
  task: Pick<AdditionTask, 'addends'>,
  columnIndex: number,
  carryIn = 0,
) => {
  const rawTotal =
    carryIn + task.addends.reduce((total, value) => total + digitAtColumn(value, columnIndex), 0);
  return {
    expectedDigit: rawTotal % 10,
    expectedCarryOut: Math.floor(rawTotal / 10),
  };
};

export const carryIntoColumn = (task: Pick<AdditionTask, 'addends'>, columnIndex: number) => {
  let carry = 0;
  for (let column = 0; column < columnIndex; column += 1) {
    carry = expectedForColumn(task, column, carry).expectedCarryOut;
  }
  return carry;
};

export const checkColumn = (
  task: AdditionTask,
  columnIndex: number,
  inputDigit: number | null,
): ColumnCheck => {
  const carryIn = carryIntoColumn(task, columnIndex);
  const expected = expectedForColumn(task, columnIndex, carryIn);
  return {
    columnIndex,
    expectedDigit: expected.expectedDigit,
    expectedCarryOut: expected.expectedCarryOut,
    correct: inputDigit === expected.expectedDigit,
  };
};

export const carryRowDigits = (task: AdditionTask) => {
  const digits: Array<number | null> = Array.from({ length: task.columns }, () => null);
  let carry = 0;
  for (let column = 0; column < task.columns; column += 1) {
    const expected = expectedForColumn(task, column, carry);
    carry = expected.expectedCarryOut;
    const visualColumn = task.columns - column - 2;
    if (carry > 0 && visualColumn >= 0) digits[visualColumn] = carry;
  }
  return digits;
};

export const isTaskSolved = (task: AdditionTask, inputs: Array<number | null>) =>
  Array.from({ length: task.columns }).every((_, column) => checkColumn(task, column, inputs[column]).correct);
