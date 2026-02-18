import { DevLog } from '../state/devLogs';
import { getDateKey } from './dates';

export interface Stats {
  totalDays: number;
  totalDevHours: number;
  avgRelevance: number;
  longestStreak: number;
  currentStreak: number;
}

export function calculateStats(devLogs: Record<string, DevLog[]>, startDate: string): Stats {
  const dateKeys = Object.keys(devLogs).sort();
  
  if (dateKeys.length === 0) {
    return {
      totalDays: 0,
      totalDevHours: 0,
      avgRelevance: 0,
      longestStreak: 0,
      currentStreak: 0
    };
  }

  let totalDevHours = 0;
  let totalRelevance = 0;
  let relevanceCount = 0;

  dateKeys.forEach(dateKey => {
    const logs = devLogs[dateKey];
    logs.forEach(log => {
      totalDevHours += log.hours;
      if (log.relevance !== undefined) {
        totalRelevance += log.relevance;
        relevanceCount++;
      }
    });
  });

  const avgRelevance = relevanceCount > 0 ? totalRelevance / relevanceCount : 0;

  const { longestStreak, currentStreak } = calculateStreaks(devLogs);

  return {
    totalDays: dateKeys.length,
    totalDevHours,
    avgRelevance,
    longestStreak,
    currentStreak
  };
}

function calculateStreaks(devLogs: Record<string, DevLog[]>): { longestStreak: number; currentStreak: number } {
  const dateKeys = Object.keys(devLogs).sort();
  
  if (dateKeys.length === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  let longestStreak = 0;
  let currentStreakCount = 0;
  let tempStreak = 0;

  const today = getDateKey(new Date());
  let lastDateTimestamp: number | null = null;

  dateKeys.forEach(dateKey => {
    const logs = devLogs[dateKey];
    const hasDevWork = logs.some(log => log.hours > 0);
    
    if (!hasDevWork) return;

    const currentDate = new Date(dateKey);
    const currentTimestamp = currentDate.getTime();
    
    if (lastDateTimestamp === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.floor((currentTimestamp - lastDateTimestamp) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    if (dateKey === today) {
      currentStreakCount = tempStreak;
    }
    
    lastDateTimestamp = currentTimestamp;
  });

  // Check if current streak is still active
  if (lastDateTimestamp !== null) {
    const daysSinceLastLog = Math.floor((new Date().getTime() - lastDateTimestamp) / (1000 * 60 * 60 * 24));
    if (daysSinceLastLog > 1) {
      currentStreakCount = 0;
    }
  }

  return { longestStreak, currentStreak: currentStreakCount };
}

export function getMonthlyDiscipline(devLogs: Record<string, DevLog[]>): number {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  let totalDays = 0;
  let daysWithWork = 0;

  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    totalDays++;
    const dateKey = getDateKey(new Date(d));
    const logs = devLogs[dateKey] || [];
    if (logs.some(log => log.hours > 0)) {
      daysWithWork++;
    }
  }

  return totalDays > 0 ? Math.round((daysWithWork / totalDays) * 100) : 0;
}
