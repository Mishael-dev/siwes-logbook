import { startOfWeek, addDays, getWeek, format, parseISO, isMonday, isTuesday, isWednesday, isThursday, isFriday, getYear } from 'date-fns';
import { getAllWeeks } from '@/app/actions/activity'; 

export interface Activity {
  id?: string;
  time: string;
  activity: string;
}

export interface WeekEntry {
  week: number;
  year: number;
  entries: Activity[];
}

export function getCurrentWeekNumber(date: Date = new Date()): number {
  return getWeek(date, { weekStartsOn: 1 });
}

export function getCurrentYear(date: Date = new Date()): number {
  return getYear(date);
}

export function isWorkday(date: Date = new Date()): boolean {
  return isMonday(date) || isTuesday(date) || isWednesday(date) || isThursday(date) || isFriday(date);
}

export async function getWeekEntry(weekNumber: number, year: number): Promise<WeekEntry | undefined> {
  const weeks = await getAllWeeks();
  return weeks.find(w => w.week === weekNumber && w.year === year);
}

export async function getTodayActivities(date: Date = new Date()): Promise<Activity[]> {
  const weekNumber = getCurrentWeekNumber(date);
  const year = getCurrentYear(date);
  const weekEntry = await getWeekEntry(weekNumber, year);
  
  if (!weekEntry) return [];
  
  const todayStr = format(date, 'yyyy-MM-dd');
  return weekEntry.entries.filter(entry => {
    const entryDate = format(parseISO(entry.time), 'yyyy-MM-dd');
    return entryDate === todayStr;
  });
}

export function formatTime(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'h:mm a');
}

export function formatDayName(date: Date = new Date()): string {
  return format(date, 'EEEE');
}

export function formatFullDate(date: Date = new Date()): string {
  return format(date, 'MMMM d, yyyy');
}

export function getWeekRangeSync(weekNumber: number, year: number): string {
  const firstDayOfYear = new Date(year, 0, 1);
  const start = startOfWeek(addDays(firstDayOfYear, (weekNumber - 1) * 7), { weekStartsOn: 1 });
  const end = addDays(start, 6);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}