"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Activity, WeekEntry } from "@/lib/storage";
import { getWeekEntry, updateActivityAction, deleteActivityAction } from "@/app/actions/activity";
import { getWeekRangeSync, formatTime } from "@/lib/storage";
import { ChevronLeft, Calendar, Sparkles, Loader2, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserHeader } from "@/components/UserHeader";
import { EditActivityModal } from "@/components/EditActivityModal";
import { SummaryModal } from "@/components/SummaryModal";
import { generateDaySummaryPrompt, generateWeekSummaryPrompt } from "@/lib/ai-summary";
import { format, parseISO } from "date-fns";

export default function WeekDetails() {
  const { year, week } = useParams<{ year: string; week: string }>();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [weekEntry, setWeekEntry] = useState<WeekEntry | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Summary state
  const [summaryType, setSummaryType] = useState<'day' | 'week'>('week');
  const [selectedDayKey, setSelectedDayKey] = useState<string>('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const weekNumber = parseInt(week ?? "0", 10);
  const yearNumber = parseInt(year ?? "0", 10);

  useEffect(() => {
    setHasMounted(true);

    async function loadWeek() {
      setIsLoading(true);

      const entry = await getWeekEntry(weekNumber, yearNumber);
      const range = getWeekRangeSync(weekNumber, yearNumber);

      setWeekEntry(entry);
      setDateRange(range || `${yearNumber}`);
      setIsLoading(false);
    }

    loadWeek();
  }, [weekNumber, yearNumber]);

  // Handler functions
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedText: string) => {
    if (!editingActivity?.id) return;
    
    try {
      setIsSubmitting(true);
      await updateActivityAction(editingActivity.id, updatedText);
      
      // Refresh the week data
      const entry = await getWeekEntry(weekNumber, yearNumber);
      setWeekEntry(entry);
      
      setIsEditModalOpen(false);
      setEditingActivity(null);
    } catch (error) {
      console.error('Failed to update activity:', error);
      alert('Failed to update activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await deleteActivityAction(activityId);
      
      // Refresh the week data
      const entry = await getWeekEntry(weekNumber, yearNumber);
      setWeekEntry(entry);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const handleGenerateDaySummary = async (dayKey: string, activities: Activity[]) => {
    setSelectedDayKey(dayKey);
    setSummaryType('day');
    setGeneratedSummary('');
    setIsSummaryOpen(true);
  };

  const handleGenerateWeekSummary = () => {
    setSummaryType('week');
    setGeneratedSummary('');
    setIsSummaryOpen(true);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      let prompt = '';
      if (summaryType === 'day') {
        const dayData = activitiesByDay[selectedDayKey];
        if (!dayData) return;
        prompt = await generateDaySummaryPrompt(dayData.activities, selectedDayKey);
      } else {
        const weekData = sortedDays.map(([_, data]) => ({
          dayName: data.dayName,
          activities: data.activities
        }));
        prompt = await generateWeekSummaryPrompt(weekData);
      }
      
      // Here you would call your AI API
      // For now, we'll just show the prompt
      setGeneratedSummary(prompt);
      
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Group activities by day
  const activitiesByDay =
    weekEntry?.entries.reduce<
      Record<string, { dayName: string; activities: Activity[] }>
    >((acc, entry) => {
      const date = parseISO(entry.time);
      const dayKey = format(date, "yyyy-MM-dd");
      const dayName = format(date, "EEEE, MMMM d");

      if (!acc[dayKey]) {
        acc[dayKey] = { dayName, activities: [] };
      }

      acc[dayKey].activities.push(entry);
      return acc;
    }, {}) || {};

  const sortedDays = Object.entries(activitiesByDay).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  if (!hasMounted) return null;

  // 🔄 Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

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
                {/* Day Header with Generate Button */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-lg font-serif text-foreground">
                    {dayName}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateDaySummary(dayKey, activities)}
                    className="h-8 px-3 rounded-lg text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Day Summary
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <div
                      key={`${activity.time}-${index}`}
                      className="activity-item group"
                    >
                      <div className="flex items-start justify-between gap-3 p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
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
                        
                        {/* Edit/Delete Actions */}
                        <div className="flex items-center shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(activity)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            aria-label="Edit activity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => activity.id && handleDelete(activity.id)}
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
            ))}
          </div>
        )}
      </div>

      {/* Generate Summary Button */}
      <div className="fixed bottom-6 left-0 right-0 z-30 px-6">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleGenerateWeekSummary}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Weekly Summary
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveEdit}
        activity={editingActivity}
        isSubmitting={isSubmitting}
      />

      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setGeneratedSummary('');
        }}
        onGenerate={handleGenerate}
        generatedText={generatedSummary}
        isGenerating={isGenerating}
        title={summaryType === 'day' ? 'Daily Summary' : 'Weekly Summary'}
      />
    </div>
  );
}