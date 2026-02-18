import { useState, useEffect } from 'react';
import { storage } from './storage';

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export function useBadges() {
  const [badges, setBadges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedBadges = storage.getBadges();
    setBadges(savedBadges);
  }, []);

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const updated = { ...prev, [badgeId]: true };
      storage.setBadges(updated);
      return updated;
    });
  };

  const checkAndUnlockBadges = (stats: {
    longestStreak: number;
    currentStreak: number;
    totalDevHours: number;
  }) => {
    if (stats.longestStreak >= 7 && !badges['7_day_streak']) {
      unlockBadge('7_day_streak');
    }
    if (stats.longestStreak >= 30 && !badges['30_day_streak']) {
      unlockBadge('30_day_streak');
    }
    if (stats.totalDevHours >= 100 && !badges['100_hours']) {
      unlockBadge('100_hours');
    }
    if (stats.currentStreak >= 7 && !badges['no_zero_days']) {
      unlockBadge('no_zero_days');
    }
  };

  return {
    badges,
    unlockBadge,
    checkAndUnlockBadges
  };
}
