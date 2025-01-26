import { ExtendedActivity } from '@/components/heatmap-study';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
