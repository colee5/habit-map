'use client';

import { ActivityResponse } from '@/db/schema';
import HeatMap from '@uiw/react-heat-map';
import { useEffect, useState } from 'react';

interface Props {
  year: string;
}

interface Activity {
  date: string;
  count: number;
}

const emptyValue = [{ date: '2025/1/25', count: 1 }];

export const HeatmapWorkout = ({ year }: Props) => {
  const [activities, setActivities] = useState<Activity[]>(emptyValue);

  const fetchActivities = async () => {
    const studyActivities = await fetch('/api/activities?type=workout').then(
      (res) => res.json()
    );

    const formattedActivities = studyActivities.map(
      (activity: ActivityResponse) => ({
        date: activity.date.toString().split('T')[0].replace(/-/g, '/'),
        count: activity.count,
      })
    );

    setActivities(formattedActivities);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="w-full overflow-auto">
      <HeatMap
        value={activities ? activities : []}
        width={600}
        panelColors={['#EBEDF0', '#FFB5B5', '#FF8989', '#FF5A5A', '#CC4747']}
        startDate={new Date(`${year}/01/01`)}
        legendCellSize={0}
        rectProps={{ rx: 3.2 }}
      />
    </div>
  );
};
