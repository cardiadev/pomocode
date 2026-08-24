import type { StatsSnapshot } from './protocol';

export interface BadgeDefinition {
  id: string;
  label: string;
  emoji: string;
  description: string;
  isUnlocked: (stats: StatsSnapshot) => boolean;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-focus',
    label: 'First Focus',
    emoji: '🌱',
    description: 'Complete your first focus session.',
    isUnlocked: (stats) => stats.allTimeCount >= 1,
  },
  {
    id: 'ten-sessions',
    label: 'Getting Started',
    emoji: '📘',
    description: 'Complete 10 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 10,
  },
  {
    id: 'fifty-sessions',
    label: 'Deep Worker',
    emoji: '⚙️',
    description: 'Complete 50 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 50,
  },
  {
    id: 'hundred-sessions',
    label: 'Centurion',
    emoji: '💯',
    description: 'Complete 100 focus sessions.',
    isUnlocked: (stats) => stats.allTimeCount >= 100,
  },
  {
    id: 'streak-3',
    label: '3-Day Spark',
    emoji: '✨',
    description: 'Reach a 3-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 3,
  },
  {
    id: 'streak-7',
    label: '7-Day Flame',
    emoji: '🔥',
    description: 'Reach a 7-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 7,
  },
  {
    id: 'streak-30',
    label: '30-Day Blaze',
    emoji: '🚀',
    description: 'Reach a 30-day streak.',
    isUnlocked: (stats) => stats.currentStreakDays >= 30,
  },
];
