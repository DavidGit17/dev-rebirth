import { useState, useEffect } from 'react';
import { storage } from './storage';

export type ActivityType = 'gaming' | 'social_media' | 'series_movies' | 'youtube' | 'going_out' | 'sleeping_extra' | 'other';
export type Category = 'necessary' | 'time_pass' | 'pure_distraction';
export type Mood = 'good' | 'neutral' | 'regret' | 'wasted';

export interface NonDevLog {
  id: string;
  dateKey: string;
  activityType: ActivityType;
  hours: number;
  category: Category;
  mood: Mood;
  notes: string;
  timestamp: number;
}

export function useNonDevLogs() {
  const [nonDevLogs, setNonDevLogs] = useState<Record<string, NonDevLog[]>>({});

  useEffect(() => {
    const logs = storage.getNonDevLogs();
    setNonDevLogs(logs);
  }, []);

  const saveLog = (log: Omit<NonDevLog, 'id' | 'timestamp'>) => {
    const newLog: NonDevLog = {
      ...log,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };

    setNonDevLogs(prev => {
      const dateKey = log.dateKey;
      const dateLogs = prev[dateKey] || [];
      const updated = { ...prev, [dateKey]: [...dateLogs, newLog] };
      storage.setNonDevLogs(updated);
      return updated;
    });
  };

  const getLogsForDate = (dateKey: string): NonDevLog[] => {
    return nonDevLogs[dateKey] || [];
  };

  const getTotalHoursForDate = (dateKey: string): number => {
    const logs = nonDevLogs[dateKey] || [];
    return logs.reduce((sum, log) => sum + log.hours, 0);
  };

  return {
    nonDevLogs,
    saveLog,
    getLogsForDate,
    getTotalHoursForDate
  };
}
