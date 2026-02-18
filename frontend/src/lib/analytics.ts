import { DevLog } from '../state/devLogs';
import { NonDevLog } from '../state/nonDevLogs';
import { getDateKey, parseDateKey } from './dates';

export function getLast7DaysKeys(): string[] {
  const keys: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    keys.push(getDateKey(date));
  }
  
  return keys;
}

export function calculateWeeklyDistraction(nonDevLogs: Record<string, NonDevLog[]>): number {
  const last7Days = getLast7DaysKeys();
  let totalHours = 0;
  
  last7Days.forEach(dateKey => {
    const logs = nonDevLogs[dateKey] || [];
    totalHours += logs.reduce((sum, log) => sum + log.hours, 0);
  });
  
  return totalHours;
}

export function getMostCommonDistraction(nonDevLogs: Record<string, NonDevLog[]>): string {
  const last7Days = getLast7DaysKeys();
  const activityTotals: Record<string, number> = {};
  
  last7Days.forEach(dateKey => {
    const logs = nonDevLogs[dateKey] || [];
    logs.forEach(log => {
      activityTotals[log.activityType] = (activityTotals[log.activityType] || 0) + log.hours;
    });
  });
  
  if (Object.keys(activityTotals).length === 0) return 'NONE';
  
  return Object.entries(activityTotals).reduce((max, [activity, hours]) => 
    hours > (activityTotals[max] || 0) ? activity : max
  , Object.keys(activityTotals)[0]);
}

export function calculateDisciplineScore(devHours: number, nonDevHours: number): number {
  const total = devHours + nonDevHours;
  if (total === 0) return 0;
  return Math.round((devHours / total) * 100);
}

export function getDisciplineTier(score: number): string {
  if (score >= 80) return 'HIGHLY DISCIPLINED';
  if (score >= 50) return 'IMPROVING';
  return 'LOSING CONTROL';
}
