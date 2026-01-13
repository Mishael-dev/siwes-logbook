"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DayHeader } from '@/components/DayHeader';
import { ActivityList } from '@/components/ActivityList';
import { AddActivityInput } from '@/components/AddActivityInput';
import { FloatingActions } from '@/components/FloatingActions';
import { UserHeader } from '@/components/UserHeader';
import { Activity, getTodayActivities, addActivity, getAllWeeks, isWorkday } from '@/lib/storage';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [currentDate] = useState(new Date());
  const workday = isWorkday(currentDate);
  const allWeeks = getAllWeeks();
  const hasAnyActivities = allWeeks.some(week => week.entries.length > 0);

  const loadActivities = useCallback(() => {
    const todayActivities = getTodayActivities(currentDate);
    setActivities(todayActivities);
  }, [currentDate]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleAddActivity = (activityText: string) => {
    addActivity(activityText, currentDate);
    loadActivities();
    toast.success('Activity saved');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <DayHeader date={currentDate} />
      <UserHeader />
      
      {/* Weekend Notice */}
      {!workday && (
        <div className="mx-6 mb-4 p-4 bg-accent rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-foreground">
              It's the weekend!
            </p>
            <p className="text-sm text-accent-foreground/80 mt-0.5">
              SIWES activities are typically recorded Monday to Friday.
            </p>
          </div>
        </div>
      )}
      
      {/* Activity List */}
      <ActivityList activities={activities} />
      
      {/* Floating Action Buttons */}
      <FloatingActions
        onAddClick={() => setIsInputOpen(true)}
        onActivitiesClick={() => router.push('/activities')}
        hasActivities={hasAnyActivities}
      />
      
      {/* Add Activity Input */}
      <AddActivityInput
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
        onSubmit={handleAddActivity}
      />
    </div>
  );
};

export default Index;
