import { Activity, formatTime } from '@/lib/storage';
import { Clock } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-center text-base">
          No activities recorded today
        </p>
        <p className="text-muted-foreground/70 text-center text-sm mt-1">
          Tap the button below to add your first activity
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pb-32 overflow-y-auto scrollbar-hide">
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={`${activity.time}-${index}`}
            className="activity-item fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-base leading-relaxed">
                  {activity.activity}
                </p>
                <p className="text-text-secondary text-sm mt-1.5">
                  {formatTime(activity.time)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
