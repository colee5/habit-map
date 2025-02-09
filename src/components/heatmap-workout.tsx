'use client';

import { generateEmptyYearData, generateFullYearData } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ActivityCalendar, {
  Activity as LibActivity,
} from 'react-activity-calendar';
import { renderBlock } from './heatmap-tooltip';
import { TooltipProvider } from './ui/tooltip';

interface Props {
  year: string;
  user: 'cole' | 'keki';
  refresh: number;
}

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

export const HeatmapWorkout = ({ year, user, refresh }: Props) => {
  const [activities, setActivities] = useState<ExtendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const workoutActivities = await fetch(
        `/api/activities?type=workout&user=${user}`
      ).then((res) => res.json());

      const fullYearData = generateFullYearData(workoutActivities, year);
      setActivities(fullYearData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      const fullYearData = generateFullYearData([]);
      setActivities(fullYearData);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetchActivities();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refresh]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full overflow-auto">
        <ActivityCalendar
          data={activities.length ? activities : generateEmptyYearData(year)}
          blockSize={10}
          blockRadius={2.5}
          loading={isLoading}
          blockMargin={2}
          fontSize={11}
          renderBlock={renderBlock}
          theme={{
            dark: ['#EAEDF0', '#FFB5B5', '#FF8989', '#FF5A5A', '#CC4747'],
          }}
          hideColorLegend={false}
          showWeekdayLabels={false}
          style={{ width: '100%' }}
        />
      </div>
    </TooltipProvider>
  );
};
