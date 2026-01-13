"use server";
import { supabase } from "@/lib/supabse";
import { getCurrentWeekNumber, getCurrentYear } from '@/lib/storage';
import { auth } from "@/auth";
import { Activity, WeekEntry } from '@/lib/storage';



export async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not authenticated");
  return session.user.id;
}



export async function getAllWeeks() {
  const userId = await getUserId();
  // Fetch all activities for the user
  const { data, error } = await supabase
    .from('siwes_logs')
    .select('*')
    .eq('user_id', userId)
    .order('time', { ascending: true });



  if (error) {
    console.error('Supabase fetch error:', error);
    return []; // prevent runtime crash
  }

  // Group activities by week + year
  const weeksMap: Record<string, WeekEntry> = {};

  data.forEach(activity => {
    const key = `${activity.week}-${activity.year}`;
    if (!weeksMap[key]) {
      weeksMap[key] = { week: activity.week, year: activity.year, entries: [] };
    }
      weeksMap[key].entries.push({
    time: activity.time,
    activity: activity.activity,
    id: activity.id, 
  }as Activity);
  });

  // Convert the map to an array
  return Object.values(weeksMap);
}
export async function addActivity(activityText: string, date: Date = new Date()) {
  const weekNumber = getCurrentWeekNumber(date);
  const year = getCurrentYear(date);
  const userId = await getUserId();

  const newActivity = {
    activity: activityText,
    time: date.toISOString(),
    week: weekNumber,
    year: year,
    user_id: userId,
  };

  // Insert into Supabase DB
  const { data, error } = await supabase
    .from('siwes_logs')
    .insert([newActivity])
    .select(); 

  if (error) throw error;

  return data[0]; 
}

// @/app/actions/activity.ts

// ... existing imports ...

export async function deleteActivityAction(activityId: string) {
  const userId = await getUserId();
  
  const { error } = await supabase
    .from('siwes_logs')
    .delete()
    .eq('id', activityId)
    .eq('user_id', userId); // Security: ensure user owns the entry

  if (error) throw new Error(error.message);
  return true;
}

export async function updateActivityAction(activityId: string, newText: string) {
  const userId = await getUserId();

  const { error } = await supabase
    .from('siwes_logs')
    .update({ activity: newText })
    .eq('id', activityId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return true;
}

export async function getWeekEntry(weekNumber: number, year: number): Promise<WeekEntry | null> {
  const userId = await getUserId();
  
  const { data, error } = await supabase
    .from('siwes_logs')   
    .select('*')
    .eq('week', weekNumber)
    .eq('year', year)
    .eq('user_id', userId)
    .order('time', { ascending: true }); // optional, sort by time

  if (error) {
    console.error('Failed to fetch week:', error);
    return null;
  }

  if (!data || data.length === 0) return null;

  return {
    week: weekNumber,
    year: year,
    entries: data,
  };
}