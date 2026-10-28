// localStorage wrapper
const STORAGE_KEY = 'taskflow_tasks';

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
  save(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};