"use client";
import { useState, useEffect} from "react";
import { useRouter, useParams } from "next/navigation";
import { Activity, WeekEntry } from "@/lib/storage";
import { getWeekEntry } from "@/app/actions/activity";
import { getWeekRangeSync, formatTime } from "@/lib/storage";
import { ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserHeader } from "@/components/UserHeader";
import { format, parseISO } from "date-fns";



export default function WeekDetails() {
  const { year, week } = useParams<{ year: string; week: string }>();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [weekEntry, setWeekEntry] = useState<WeekEntry | null>(null); 
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  const weekNumber = parseInt(week || "0", 10);
  const yearNumber = parseInt(year || "0", 10);


useEffect(() => {
  setHasMounted(true);

  async function loadWeek() {
    const entry = await getWeekEntry(weekNumber, yearNumber);
    const range = getWeekRangeSync(weekNumber, yearNumber);

    setWeekEntry(entry);
    setDateRange(range || `${yearNumber}`);
  }

  loadWeek();
}, [weekNumber, yearNumber]);

  // Group activities by day
  const activitiesByDay =
  weekEntry?.entries.reduce<Record<string, { dayName: string; activities: Activity[] }>>(
    (acc, entry) => {
      const date = parseISO(entry.time);
      const dayKey = format(date, "yyyy-MM-dd");
      const dayName = format(date, "EEEE, MMMM d");

      if (!acc[dayKey]) {
        acc[dayKey] = { dayName, activities: [] };
      }

      acc[dayKey].activities.push(entry);
      return acc;
    },
    {}
  ) || {};
  const sortedDays = Object.entries(activitiesByDay).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  if (!hasMounted) return null; 

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/activities")}
            className="h-10 w-10 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-serif text-foreground">
              Week {weekNumber}
            </h1>
            <p className="text-sm text-text-secondary">
              {dateRange} • {weekEntry?.entries.length || 0} activities
            </p>
          </div>
        </div>
        <UserHeader />
      </header>

      {/* Activities */}
      <div className="flex-1 px-6 py-6 pb-32 overflow-y-auto scrollbar-hide">
        {!weekEntry || weekEntry.entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center text-base">
              No activities for this week
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDays.map(([dayKey, { dayName, activities }], dayIndex) => (
              <div
                key={dayKey}
                className="fade-in"
                style={{ animationDelay: `${dayIndex * 100}ms` }}
              >
                <h2 className="text-lg font-serif text-foreground mb-3 px-1">
                  {dayName}
                </h2>
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <div
                      key={`${activity.time}-${index}`}
                      className="activity-item"
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
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
            ))}
          </div>
        )}
      </div>

      {/* Generate Summary Button */}
        <div className="fixed bottom-6 left-0 right-0 z-30 px-6">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => setIsSummaryOpen(true)}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Weekly Summary
            </Button>
          </div>
        </div>
    </div>
  );
}