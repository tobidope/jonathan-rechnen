import { Award, Flame, RefreshCcw, RotateCcw, Rocket, Star, Target } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { carryRowDigits, checkColumn } from './domain/columnChecker';
import { DAILY_GOAL, BADGES, loadProgress, recordSolvedTask, resetProgress, saveProgress } from './domain/progress';
import { generateTask } from './domain/taskGenerator';
import type { AdditionTask, ProgressState } from './domain/types';

const keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const formatNumber = (value: number) => new Intl.NumberFormat('de-DE').format(value);

const cellDigits = (value: number, columns: number) =>
  value.toString().padStart(columns, ' ').split('').map((digit) => (digit === ' ' ? '' : digit));

export function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [task, setTask] = useState<AdditionTask>(() => generateTask(loadProgress().currentLevel));
  const [inputs, setInputs] = useState<Array<number | null>>(() => Array.from({ length: task.columns }, () => null));
  const [activeColumn, setActiveColumn] = useState(0);
  const [mistakes, setMistakes] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('Starte rechts bei den Einern.');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const carries = useMemo(() => carryRowDigits(task), [task]);
  const visibleInput = Array.from({ length: task.columns }, (_, visualIndex) => {
    const column = task.columns - visualIndex - 1;
    return inputs[column];
  });

  const startTask = (level = progress.currentLevel) => {
    const nextTask = generateTask(level);
    setTask(nextTask);
    setInputs(Array.from({ length: nextTask.columns }, () => null));
    setActiveColumn(0);
    setMistakes({});
    setMessage('Starte rechts bei den Einern.');
  };

  const applyDigit = (digit: number) => {
    const result = checkColumn(task, activeColumn, digit);
    const nextInputs = [...inputs];
    nextInputs[activeColumn] = digit;
    setInputs(nextInputs);

    if (!result.correct) {
      setMistakes((current) => ({ ...current, [activeColumn]: (current[activeColumn] ?? 0) + 1 }));
      setMessage('Korrigiere diese Spalte und probiere es noch einmal.');
      return;
    }

    if (activeColumn < task.columns - 1) {
      setActiveColumn((column) => column + 1);
      setMessage(result.expectedCarryOut > 0 ? `Uebertrag ${result.expectedCarryOut} mitnehmen.` : 'Richtig. Weiter nach links.');
      return;
    }

    const nextProgress = recordSolvedTask(progress, task, mistakes);
    setProgress(nextProgress);
    setMessage(`Gelost: ${formatNumber(task.sum)}. Neue Aufgabe kommt.`);
    window.setTimeout(() => startTask(nextProgress.currentLevel), 450);
  };

  const deleteDigit = () => {
    const nextInputs = [...inputs];
    nextInputs[activeColumn] = null;
    setInputs(nextInputs);
    setMessage('Zahl geloescht. Du kannst korrigieren.');
  };

  const moveColumn = (direction: -1 | 1) => {
    setActiveColumn((column) => Math.min(task.columns - 1, Math.max(0, column + direction)));
  };

  const earnedBadges = BADGES.filter((badge) => progress.badges.includes(badge.id));

  return (
    <main className="app-shell">
      <div className="starscape" aria-hidden="true" />
      <section className="topbar" aria-label="Fortschritt">
        <div className="brand">
          <Rocket size={30} />
          <div>
            <h1>Jonathan Rechnen</h1>
            <p>Schriftliche Addition</p>
          </div>
        </div>
        <div className="stats">
          <Stat icon={<Star />} label="Sterne" value={progress.stars} />
          <Stat icon={<Flame />} label="Serie" value={progress.streak} />
          <Stat icon={<Target />} label="Heute" value={`${progress.dailySolvedCount}/${DAILY_GOAL}`} />
        </div>
      </section>

      <section className="mission-grid">
        <aside className="mission-panel">
          <div className="level-orbit">
            <span>Level</span>
            <strong>{progress.currentLevel}</strong>
          </div>
          <p className="mission-text">Summe unter {formatNumber(task.sum < 100 ? 100 : task.sum < 1000 ? 1000 : task.sum < 10000 ? 10000 : task.sum < 100000 ? 100000 : 1000000)}</p>
          <div className="progress-line">
            <span>Aufgaben</span>
            <strong>{progress.totalSolved}</strong>
          </div>
          <div className="progress-line">
            <span>Beste Serie</span>
            <strong>{progress.bestStreak}</strong>
          </div>
          <div className="badge-row" aria-label="Abzeichen">
            {earnedBadges.length === 0 ? (
              <span className="empty-badge">Noch kein Badge</span>
            ) : (
              earnedBadges.map((badge) => (
                <span className="badge" title={badge.description} key={badge.id}>
                  <Award size={16} />
                  {badge.label}
                </span>
              ))
            )}
          </div>
          <button className="ghost-button" type="button" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw size={18} />
            Reset
          </button>
        </aside>

        <section className="workbench" aria-label="Aufgabe">
          <div className="task-header">
            <div>
              <span className="eyebrow">Mission</span>
              <h2>Addiere die Zahlen</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => startTask()} aria-label="Neue Aufgabe">
              <RefreshCcw />
            </button>
          </div>

          <div className="addition-board" style={{ '--columns': task.columns } as CSSProperties}>
            <div className="carry-row">
              <span className="operator-space" />
              {carries.map((digit, index) => (
                <span className="carry-cell" key={`carry-${index}`}>
                  {digit ?? ''}
                </span>
              ))}
            </div>
            {task.addends.map((addend, rowIndex) => (
              <div className="number-row" key={`${task.id}-${rowIndex}`}>
                <span className="operator">{rowIndex === task.addends.length - 1 ? '+' : ''}</span>
                {cellDigits(addend, task.columns).map((digit, index) => (
                  <span className="digit-cell fixed" key={`${addend}-${index}`}>
                    {digit}
                  </span>
                ))}
              </div>
            ))}
            <div className="result-line" />
            <div className="number-row result-row">
              <span className="operator-space" />
              {visibleInput.map((digit, visualIndex) => {
                const column = task.columns - visualIndex - 1;
                return (
                  <button
                    className={`digit-cell input-cell ${column === activeColumn ? 'active' : ''} ${mistakes[column] ? 'had-mistake' : ''}`}
                    key={`input-${column}`}
                    type="button"
                    onClick={() => setActiveColumn(column)}
                    aria-label={`Spalte ${column + 1}`}
                  >
                    {digit ?? ''}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="feedback" role="status">
            {message}
          </p>

          <div className="keypad" aria-label="Ziffernblock">
            {keypad.map((digit) => (
              <button type="button" key={digit} onClick={() => applyDigit(digit)}>
                {digit}
              </button>
            ))}
            <button type="button" className="wide" onClick={deleteDigit}>
              Löschen
            </button>
            <button type="button" onClick={() => moveColumn(1)}>
              Links
            </button>
            <button type="button" onClick={() => moveColumn(-1)}>
              Rechts
            </button>
          </div>
        </section>
      </section>

      {showResetConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Reset bestaetigen">
          <div className="modal">
            <h2>Fortschritt zuruecksetzen?</h2>
            <p>Level, Sterne, Serien und Badges werden nur auf diesem Geraet geloescht.</p>
            <div className="modal-actions">
              <button type="button" className="danger" onClick={() => {
                const fresh = resetProgress();
                setProgress(fresh);
                setShowResetConfirm(false);
                startTask(fresh.currentLevel);
              }}>
                Ja, resetten
              </button>
              <button type="button" onClick={() => setShowResetConfirm(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
