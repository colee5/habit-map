'use client';

import { BlockElement, Activity as LibActivity } from 'react-activity-calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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

export const renderBlock = (
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
                  <p>- Activity completed</p>
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
