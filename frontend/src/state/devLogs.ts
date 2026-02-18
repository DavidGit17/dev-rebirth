import { useState, useEffect } from 'react';
import { storage } from './storage';

export type TimeSection = 'morning' | 'afternoon' | 'evening' | 'night';
export type FocusLevel = 'deep' | 'normal' | 'distracted';

export interface DevLog {
  dateKey: string;
  section: TimeSection;
  description: string;
  activities: string[];
  hours: number;
  relevance?: number;
  focus: FocusLevel;
  notes: string;
  timestamp: number;
}

export function useDevLogs() {
  const [devLogs, setDevLogs] = useState<Record<string, DevLog[]>>({});

  useEffect(() => {
    const logs = storage.getDevLogs();
    setDevLogs(logs);
  }, []);

  const saveLog = (log: DevLog) => {
    setDevLogs(prev => {
      const dateKey = log.dateKey;
      const dateLogs = prev[dateKey] || [];
      const existingIndex = dateLogs.findIndex(l => l.section === log.section);
      
      let updatedDateLogs;
      if (existingIndex >= 0) {
        updatedDateLogs = [...dateLogs];
        updatedDateLogs[existingIndex] = log;
      } else {
        updatedDateLogs = [...dateLogs, log];
      }
      
      const updated = { ...prev, [dateKey]: updatedDateLogs };
      storage.setDevLogs(updated);
      return updated;
    });
  };

  const getLog = (dateKey: string, section: TimeSection): DevLog | undefined => {
    const dateLogs = devLogs[dateKey] || [];
    return dateLogs.find(log => log.section === section);
  };

  const getLogsForDate = (dateKey: string): DevLog[] => {
    return devLogs[dateKey] || [];
  };

  const getTotalHoursForDate = (dateKey: string): number => {
    const logs = devLogs[dateKey] || [];
    return logs.reduce((sum, log) => sum + log.hours, 0);
  };

  return {
    devLogs,
    saveLog,
    getLog,
    getLogsForDate,
    getTotalHoursForDate
  };
}
