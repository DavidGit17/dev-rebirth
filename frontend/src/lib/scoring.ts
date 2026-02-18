import { DevLog } from '../state/devLogs';

export interface DayScore {
  totalHours: number;
  avgRelevance: number;
  focusRating: 'deep' | 'normal' | 'distracted' | 'mixed';
  performanceLevel: 'high' | 'medium' | 'low';
}

export function calculateDayScore(logs: DevLog[]): DayScore {
  if (logs.length === 0) {
    return {
      totalHours: 0,
      avgRelevance: 0,
      focusRating: 'distracted',
      performanceLevel: 'low'
    };
  }

  const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
  const relevanceScores = logs.filter(log => log.relevance !== undefined).map(log => log.relevance!);
  const avgRelevance = relevanceScores.length > 0 
    ? relevanceScores.reduce((sum, r) => sum + r, 0) / relevanceScores.length 
    : 0;

  const focusCounts = logs.reduce((acc, log) => {
    acc[log.focus]++;
    return acc;
  }, { deep: 0, normal: 0, distracted: 0 } as Record<string, number>);

  let focusRating: 'deep' | 'normal' | 'distracted' | 'mixed' = 'normal';
  if (focusCounts.deep > focusCounts.normal && focusCounts.deep > focusCounts.distracted) {
    focusRating = 'deep';
  } else if (focusCounts.distracted > focusCounts.deep && focusCounts.distracted > focusCounts.normal) {
    focusRating = 'distracted';
  } else if (focusCounts.deep === focusCounts.normal || focusCounts.normal === focusCounts.distracted) {
    focusRating = 'mixed';
  }

  let performanceLevel: 'high' | 'medium' | 'low' = 'low';
  if (totalHours >= 4 && avgRelevance >= 7) {
    performanceLevel = 'high';
  } else if (totalHours >= 2 && avgRelevance >= 5) {
    performanceLevel = 'medium';
  }

  return { totalHours, avgRelevance, focusRating, performanceLevel };
}

export function getDisciplineStatus(totalHours: number, avgRelevance: number): string {
  if (totalHours === 0) {
    return 'NO DEVELOPER ACTIONS LOGGED TODAY';
  }
  if (totalHours >= 4 && avgRelevance >= 7) {
    return 'OPERATING AT PEAK DISCIPLINE';
  }
  if (totalHours >= 2 && avgRelevance >= 5) {
    return 'PROGRESS DETECTED. MAINTAIN MOMENTUM';
  }
  return 'DISCIPLINE LEVELS LOW. ACTION REQUIRED';
}

export function getProgressPercentage(totalHours: number): number {
  const target = 8;
  return Math.min((totalHours / target) * 100, 100);
}
