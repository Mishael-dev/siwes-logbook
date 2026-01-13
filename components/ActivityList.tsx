import { Activity, formatTime } from '@/lib/storage';
import { Clock, Edit2, Trash2 } from 'lucide-react';

interface ActivityListProps {
  activities?: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

export function ActivityList({ activities = [], onEdit, onDelete }: ActivityListProps) {
  
  if (!activities.length) {
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
      <div className="space-y-1"> 
        {activities.map((activity, index) => (
          <div
            key={activity.id || `${activity.time}-${index}`}
            className="activity-item fade-in group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-3 p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors">
              
              {/* Content Section */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-base leading-relaxed">
                    {activity.activity}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {activity.time ? formatTime(activity.time) : 'No time'}
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={()=>{ onEdit?.(activity)}}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  aria-label="Edit activity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => { if (activity.id) onDelete?.(activity.id)}}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  aria-label="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}