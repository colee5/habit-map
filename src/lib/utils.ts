import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ActivityResponse } from '@/db/schema';
import { Activity as LibActivity } from 'react-activity-calendar';

interface ActivityWithDescription {
  date: string;
  count: number;
  description?: string;
  type: string;
}

interface ExtendedActivity extends LibActivity {
  description?: string;
  activities?: ActivityWithDescription[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateEmptyYearData = (year: string): ExtendedActivity[] => {
  const emptyData: ExtendedActivity[] = [];
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toISOString().split('T')[0];
    emptyData.push({
      date: dateStr,
      count: 0,
      level: 0,
    });
  }
  return emptyData;
};

export const generateFullYearData = (
  workoutActivities: ActivityResponse[],
  year?: string
): ExtendedActivity[] => {
  const activitiesByDate = new Map<string, ActivityWithDescription[]>();

  workoutActivities.forEach((activity) => {
    const dateStr = activity.date.toString().split('T')[0];

    if (!activitiesByDate.has(dateStr)) {
      activitiesByDate.set(dateStr, []);
    }
    activitiesByDate.get(dateStr)?.push({
      ...activity,
      date: dateStr,
    });
  });

  const fullYearData: ExtendedActivity[] = [];
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toISOString().split('T')[0];
    const dayActivities = activitiesByDate.get(dateStr) || [];
    const totalCount = dayActivities.reduce((sum, act) => sum + act.count, 0);

    fullYearData.push({
      date: dateStr,
      count: totalCount,
      level: calculateLevel(totalCount),
      description: dayActivities
        .map((a) => a.description)
        .filter(Boolean)
        .join('\n'),
      activities: dayActivities,
    });
  }

  return fullYearData;
};

export const calculateLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
};
