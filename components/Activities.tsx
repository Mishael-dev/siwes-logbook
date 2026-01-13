"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllWeeks, getWeekRange, WeekEntry } from '@/lib/storage';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserHeader } from '@/components/UserHeader';

export default function ActivitiesPage() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  // Load data from localStorage only after the component mounts in the browser
  useEffect(() => {
    setHasMounted(true);
    const data = getAllWeeks().sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.week - a.week;
    });
    setWeeks(data);
  }, []);

  // Prevent "Hydration Mismatch" errors by not rendering until browser is ready
  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="h-10 w-10 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Activities</h1>
              <p className="text-sm text-muted-foreground">
                {weeks.length} week{weeks.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
        </div>
        {/* UserHeader can be used here even if it's an async server component */}
        <UserHeader />
      </header>

      {/* Week List */}
      <div className="flex-1 px-6 py-6 overflow-y-auto scrollbar-hide">
        {weeks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center text-base">
              No activities recorded yet
            </p>
            <p className="text-muted-foreground/70 text-center text-sm mt-1">
              Start by adding activities on the home page
            </p>
            <Button
              onClick={() => router.push('/')}
              className="mt-6"
              variant="outline"
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {weeks.map((week, index) => {
              const dateRange = getWeekRange(week.week, week.year);
              return (
                <button
                  key={`${week.year}-${week.week}`}
                  onClick={() => router.push(`/activities/week/${week.year}/${week.week}`)}
                  className="w-full flex items-center justify-between group p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all animate-in fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        W{week.week}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
                        Week {week.week}, {week.year}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{week.entries.length} activit{week.entries.length !== 1 ? 'ies' : 'y'}</span>
                        {dateRange && (
                          <div className="flex c">
                            <span>•</span>
                            <span>{dateRange}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}