import type { StatsSnapshot } from './protocol';

export type BadgeIconType =
  | 'first'
  | 'sessions-10'
  | 'sessions-50'
  | 'sessions-100'
  | 'streak-3'
  | 'streak-7'
  | 'streak-30';

export interface BadgeDefinition {
  id: string;
  label: string;
  iconType: BadgeIconType;
  description: string;
  isUnlocked: (stats: StatsSnapshot) => boolean;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-focus',
    label: 'First Focus',
    iconType: 'first',
    description: 'Complete your first focus session.',
    isUnlocked: (stats) => stats.allTimeCount >= 1,
  },
  {
    id: 'ten-sessions',
    label: 'Getting Started',
    iconType: 'sessions-10',
    description: 'Complete 10 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 10,
  },
  {
    id: 'fifty-sessions',
    label: 'Deep Worker',
    iconType: 'sessions-50',
    description: 'Complete 50 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 50,
  },
  {
    id: 'hundred-sessions',
    label: 'Centurion',
    iconType: 'sessions-100',
    description: 'Complete 100 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 100,
  },
  {
    id: 'streak-3',
    label: '3-Day Spark',
    iconType: 'streak-3',
    description: 'Reach a 3-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 3,
  },
  {
    id: 'streak-7',
    label: '7-Day Flame',
    iconType: 'streak-7',
    description: 'Reach a 7-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 7,
  },
  {
    id: 'streak-30',
    label: '30-Day Blaze',
    iconType: 'streak-30',
    description: 'Reach a 30-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 30,
  },
];
