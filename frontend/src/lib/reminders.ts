import { getTimeOfDay } from './dates';

export function getCurrentReminder(): string {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'morning':
      return 'START BUILDING';
    case 'afternoon':
      return 'STAY RELEVANT';
    case 'evening':
      return 'KEEP PROGRESSING';
    case 'night':
      return 'LOG YOUR REALITY';
  }
}
