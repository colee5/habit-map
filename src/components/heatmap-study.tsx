'use client';

import ActivityCalendar, {
  Activity as LibActivity,
  BlockElement,
} from 'react-activity-calendar';
import { ActivityResponse } from '@/db/schema';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

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

const renderBlock = (
  block: BlockElement,
  activity: LibActivity
): React.ReactElement => {
  const extendedActivity = activity as ExtendedActivity;

  if (activity.count === 0) {
    return block;
  }

  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activities = extendedActivity.activities || [];

  return (
    <Tooltip>
      <TooltipTrigger asChild>{block}</TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <p className="font-semibold mb-1">{formattedDate}</p>
        {activities.length > 0 ? (
          <div className="text-xs">
            {activities.map((act, index) => (
              <div key={index}>
                {act.description ? (
                  <p>- {act.description}</p>
                ) : (
                  <p>Activity completed</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm">Activity completed</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export const HeatmapStudy = ({ year, user, refresh }: Props) => {
  const [activities, setActivities] = useState<ExtendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateFullYearData = (
    studyActivities: ActivityResponse[]
  ): ExtendedActivity[] => {
    // Group activities by date
    const activitiesByDate = new Map<string, ActivityWithDescription[]>();

    studyActivities.forEach((activity) => {
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

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const studyActivities = await fetch(
        `/api/activities?type=study&user=${user}`
      ).then((res) => res.json());

      const fullYearData = generateFullYearData(studyActivities);
      setActivities(fullYearData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      const fullYearData = generateFullYearData([]);
      setActivities(fullYearData);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refresh]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full overflow-auto">
        <ActivityCalendar
          data={activities}
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
