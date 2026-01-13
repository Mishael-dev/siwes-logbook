"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { DayHeader } from '@/components/DayHeader';
import { ActivityList } from '@/components/ActivityList';
import { AddActivityInput } from '@/components/AddActivityInput';
import { FloatingActions } from '@/components/FloatingActions';
import { UserHeader } from '@/components/UserHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WeekEntry, Activity, getTodayActivities, isWorkday } from '@/lib/storage';
import { addActivity, getAllWeeks, deleteActivityAction, updateActivityAction } from '../app/actions/activity';

const Index = () => {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allWeeks, setAllWeeks] = useState<WeekEntry[]>([]);
  const [hasAnyActivities, setHasAnyActivities] = useState(false);
  const [currentDate] = useState(new Date());
  const workday = isWorkday(currentDate);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editValue, setEditValue] = useState("");


  useEffect(() => {
    async function fetchWeeks() {
      const weeks = await getAllWeeks();
      setAllWeeks(weeks);
      setHasAnyActivities(weeks.some(week => week.entries.length > 0));
    }
    fetchWeeks();
  }, []);

  const loadActivities = useCallback(async () => {
    const todayActivities = await getTodayActivities(currentDate);
    setActivities(todayActivities);
  }, [currentDate]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleAddActivity = async (activityText: string) => {
    await addActivity(activityText, currentDate);
    await loadActivities();
    toast.success('Activity saved');
  };

  // --- DELETE LOGIC ---
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoadingAction(true);

    // Optimistic Update
    const previousActivities = [...activities];
    setActivities(prev => prev.filter(a => a.id !== deleteId));

    try {
      await deleteActivityAction(deleteId);
      toast.success("Activity deleted");
      setDeleteId(null);
    } catch (error) {
      setActivities(previousActivities); 
      toast.error("Failed to delete");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // --- EDIT LOGIC ---
  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setEditValue(activity.activity);
  };

  const saveEdit = async () => {
    if (!editingActivity || !editingActivity.id || !editValue.trim()) return;
    if (editValue === editingActivity.activity) {
      setEditingActivity(null);
      return;
    }

    setIsLoadingAction(true);
    
    // Optimistic Update
    const previousActivities = [...activities];
    setActivities(prev => prev.map(a => 
      a.id === editingActivity.id ? { ...a, activity: editValue } : a
    ));

    try {
      await updateActivityAction(editingActivity.id, editValue);
      toast.success("Activity updated");
      setEditingActivity(null); 
    } catch (error) {
      setActivities(previousActivities); 
      toast.error("Failed to update");
    } finally {
      setIsLoadingAction(false);
    }
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DayHeader date={currentDate} />
      <UserHeader />
      
      {/* Weekend Notice */}
      {!workday && (
        <div className="mx-6 mb-4 p-4 bg-accent rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-foreground">It's the weekend!</p>
            <p className="text-sm text-accent-foreground/80 mt-0.5">
              SIWES activities are typically recorded Monday to Friday.
            </p>
          </div>
        </div>
      )}
      
      {/* List */}
      <ActivityList 
        activities={activities} 
        onDelete={openDeleteModal}
        onEdit={openEditModal}
      />
      
      {/* Floating Buttons */}
      <FloatingActions
        onAddClick={() => setIsInputOpen(true)}
        onActivitiesClick={() => router.push('/activities')}
        hasActivities={hasAnyActivities}
      />
      
      {/* Add Input */}
      <AddActivityInput
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
        onSubmit={handleAddActivity}
      />



      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="w-[90%] rounded-2xl sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this entry from your log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoadingAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); 
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. EDIT ACTIVITY (Dialog) */}
      <Dialog open={!!editingActivity} onOpenChange={(open) => !open && setEditingActivity(null)}>
        <DialogContent className="w-[90%] rounded-2xl sm:w-full">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity">Activity Description</Label>
              <Input
                id="activity"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="What did you do?"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoadingAction}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              onClick={saveEdit} 
              disabled={isLoadingAction || !editValue.trim()}
            >
              {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Index;