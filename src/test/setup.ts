import '@testing-library/jest-dom/vitest';

const memoryStorage = () => {
  let store: Record<string, string> = {};
  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] ?? null,
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    get length() {
      return Object.keys(store).length;
    },
  } satisfies Storage;
};

Object.defineProperty(globalThis, 'localStorage', {
  value: window.localStorage ?? memoryStorage(),
  configurable: true,
});
