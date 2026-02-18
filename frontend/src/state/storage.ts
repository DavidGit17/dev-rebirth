const STORAGE_KEYS = {
  INITIALIZED: 'dev_rebirth_initialized',
  START_DATE: 'dev_rebirth_start_date',
  DEV_PATH: 'dev_rebirth_dev_path',
  DEV_LOGS: 'dev_rebirth_dev_logs',
  NON_DEV_LOGS: 'dev_rebirth_non_dev_logs',
  BADGES: 'dev_rebirth_badges'
};

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

export const storage = {
  getInitialized: () => getItem(STORAGE_KEYS.INITIALIZED, false),
  setInitialized: (value: boolean) => setItem(STORAGE_KEYS.INITIALIZED, value),
  
  getStartDate: () => getItem<string | null>(STORAGE_KEYS.START_DATE, null),
  setStartDate: (date: string) => setItem(STORAGE_KEYS.START_DATE, date),
  
  getDevPath: () => getItem<string | null>(STORAGE_KEYS.DEV_PATH, null),
  setDevPath: (path: string) => setItem(STORAGE_KEYS.DEV_PATH, path),
  
  getDevLogs: () => getItem(STORAGE_KEYS.DEV_LOGS, {}),
  setDevLogs: (logs: any) => setItem(STORAGE_KEYS.DEV_LOGS, logs),
  
  getNonDevLogs: () => getItem(STORAGE_KEYS.NON_DEV_LOGS, {}),
  setNonDevLogs: (logs: any) => setItem(STORAGE_KEYS.NON_DEV_LOGS, logs),
  
  getBadges: () => getItem(STORAGE_KEYS.BADGES, {}),
  setBadges: (badges: any) => setItem(STORAGE_KEYS.BADGES, badges),
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => removeItem(key));
  }
};
