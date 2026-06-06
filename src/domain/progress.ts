import type { AdditionTask, Badge, Level, ProgressState } from './types';

export const STORAGE_KEY = 'jonathan-rechnen:v1:progress';
export const DAILY_GOAL = 10;
export const SUCCESS_RUN_TO_LEVEL_UP = 5;

export const BADGES: Badge[] = [
  { id: 'first_launch', label: 'Raketenstart', description: 'Die erste Aufgabe gelost' },
  { id: 'streak_5', label: 'Sternenserie', description: '5 Aufgaben am Stuck' },
  { id: 'daily_goal', label: 'Tagesmission', description: 'Tagesziel erreicht' },
  { id: 'level_3', label: 'Mondflug', description: 'Level 3 erreicht' },
  { id: 'level_6', label: 'Galaxie', description: 'Level 6 erreicht' },
  { id: 'total_50', label: 'Rechenprofi', description: '50 Aufgaben gelost' },
];

export const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const defaultProgress = (): ProgressState => ({
  currentLevel: 1,
  totalSolved: 0,
  stars: 0,
  streak: 0,
  bestStreak: 0,
  dailySolvedDate: todayKey(),
  dailySolvedCount: 0,
  badges: [],
  recentTaskHistory: [],
  mistakeStatsByColumn: {},
  successRunAtLevel: 0,
});

const normalizeDaily = (progress: ProgressState): ProgressState => {
  const today = todayKey();
  if (progress.dailySolvedDate === today) return progress;
  return { ...progress, dailySolvedDate: today, dailySolvedCount: 0 };
};

export const loadProgress = (): ProgressState => {
  if (typeof localStorage === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return normalizeDaily({ ...defaultProgress(), ...JSON.parse(raw) });
  } catch {
    return defaultProgress();
  }
};

export const saveProgress = (progress: ProgressState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const resetProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  return defaultProgress();
};

const nextLevel = (level: Level): Level => (Math.min(6, level + 1) as Level);

const withBadge = (badges: string[], badgeId: string, condition: boolean) =>
  condition && !badges.includes(badgeId) ? [...badges, badgeId] : badges;

export const recordSolvedTask = (
  progress: ProgressState,
  task: AdditionTask,
  mistakesByColumn: Record<number, number>,
): ProgressState => {
  const solvedCount = progress.totalSolved + 1;
  const streak = progress.streak + 1;
  const dailySolvedCount = progress.dailySolvedCount + 1;
  const mistakeCount = Object.values(mistakesByColumn).reduce((total, value) => total + value, 0);
  const cleanSolve = mistakeCount === 0;
  const successRunAtLevel = cleanSolve ? progress.successRunAtLevel + 1 : 0;
  const promoted = successRunAtLevel >= SUCCESS_RUN_TO_LEVEL_UP && progress.currentLevel < 6;
  const currentLevel = promoted ? nextLevel(progress.currentLevel) : progress.currentLevel;

  let badges = progress.badges;
  badges = withBadge(badges, 'first_launch', solvedCount >= 1);
  badges = withBadge(badges, 'streak_5', streak >= 5);
  badges = withBadge(badges, 'daily_goal', dailySolvedCount >= DAILY_GOAL);
  badges = withBadge(badges, 'level_3', currentLevel >= 3);
  badges = withBadge(badges, 'level_6', currentLevel >= 6);
  badges = withBadge(badges, 'total_50', solvedCount >= 50);

  const mistakeStatsByColumn = { ...progress.mistakeStatsByColumn };
  for (const [column, count] of Object.entries(mistakesByColumn)) {
    mistakeStatsByColumn[column] = (mistakeStatsByColumn[column] ?? 0) + count;
  }

  return {
    ...progress,
    currentLevel,
    totalSolved: solvedCount,
    stars: progress.stars + 3 + task.level,
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
    dailySolvedCount,
    badges,
    mistakeStatsByColumn,
    successRunAtLevel: promoted ? 0 : successRunAtLevel,
    recentTaskHistory: [
      {
        id: task.id,
        level: task.level,
        addends: task.addends,
        sum: task.sum,
        solvedAt: new Date().toISOString(),
        mistakes: mistakeCount,
      },
      ...progress.recentTaskHistory,
    ].slice(0, 12),
  };
};
