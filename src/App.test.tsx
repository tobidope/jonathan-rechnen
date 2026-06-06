import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { STORAGE_KEY } from './domain/progress';

describe('App smoke flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a new task and accepts keypad input', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Addiere die Zahlen/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '5' }));

    expect(screen.getByRole('status')).toHaveTextContent(/Korrigiere|Richtig|Gelost/);
  });

  it('preserves solved progress through localStorage', async () => {
    render(<App />);

    const cells = screen.getAllByRole('button', { name: /Spalte/ });
    const columns = cells.length;
    const fixedNumbers = Array.from(document.querySelectorAll('.digit-cell.fixed'))
      .map((node) => node.textContent ?? '')
      .join('');
    expect(columns).toBeGreaterThan(0);
    expect(fixedNumbers.length).toBeGreaterThan(0);

    const result = Array.from({ length: columns }, (_, column) => {
      const sum = Array.from(document.querySelectorAll('.number-row'))
        .slice(0, -1)
        .map((row) => Number(Array.from(row.querySelectorAll('.digit-cell.fixed')).map((cell) => cell.textContent || '0').join('')));
      return Math.floor(sum.reduce((total, value) => total + value, 0) / 10 ** column) % 10;
    });

    for (const digit of result) {
      await userEvent.click(screen.getByRole('button', { name: String(digit) }));
    }

    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!).totalSolved).toBe(1);
    });

  });
});
