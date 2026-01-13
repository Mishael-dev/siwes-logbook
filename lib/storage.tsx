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

const STORAGE_KEY = 'siwes-logger-data';



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
  // Get the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);
  // Compute the start date of the week
  const start = startOfWeek(addDays(firstDayOfYear, (weekNumber - 1) * 7), { weekStartsOn: 1 });
  const end = addDays(start, 6);

  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}
export async function generateWeekSummaryPrompt(weekNumber: number, year: number): Promise<string> {
  const weekEntry = await getWeekEntry(weekNumber, year);
  
  if (!weekEntry || weekEntry.entries.length === 0) {
    return 'No activities recorded for this week.';
  }
  
  // Build the activities section
  let activitiesSection = `## Week ${weekNumber} (${year})\n`;
  weekEntry.entries.forEach(entry => {
    const date = parseISO(entry.time);
    activitiesSection += `- ${format(date, 'EEEE, MMM d')} at ${format(date, 'h:mm a')}: ${entry.activity}\n`;
  });
  
  const prompt = `I will provide you with a list of daily tasks I completed during a week, formatted as follows:

${activitiesSection}

Your task is to:

1. Proofread all entries for grammar, spelling, and clarity.

2. Convert each task into the following format:

   * Start with the time (e.g., "By 9:30 AM"), followed by a pronoun ("I" or "we"), then the activity (e.g., "attended the stand-up meeting"), and a concise description of relevant details. Keep each activity clear and professional but not too long.

3. Structure the daily activities by day with sub-headers (Monday, Tuesday, etc.).

4. Write a concise weekly summary in **one paragraph**, under 400 words, that:

   * Explains any technical tools used (assume the reader may not know them, e.g., Salesforce, Trailhead)

   * Summarizes your learning and accomplishments during the week

   * Reads professionally and is easy to understand

5. Generate all output in **Markdown format**, with day sub-headers, activities in the time-first style, and the weekly summary as a single paragraph.

**Output format example in Markdown:**

\`\`\`markdown

### Monday

By 9:30 AM, I attended the first team stand-up meeting of the year on Google Meet and was introduced to the team. We briefly reviewed ongoing projects and received a company briefing.

By 11:00 AM, I set up my development environment for Salesforce, including installing Salesforce DX (SFDX) and Visual Studio Code.

### Tuesday

By 9:30 AM, I attended the daily stand-up meeting to discuss previous day's tasks and plan for the current day.

By 9:30 AM, I had a one-on-one call with my supervisor, Mr. Shadrack, who explained my role as AI Thought Leader and assigned me the AgentBlazer Trail on Trailhead to build AI agent skills.

### Wednesday

By 9:30 AM, I attended the stand-up meeting to update the team on tasks and discuss blockers.

By 9:30 AM, I followed up with my supervisor regarding my role and progress on the AgentBlazer Trail.

### Thursday

By 9:30 AM, I attended the daily stand-up meeting to discuss tasks and challenges.

By [Insert Time], I completed the Agent Planning Module on Trailhead, learning about risk management, deterministic and prompt-based actions, and process mapping for AI agents.

### Friday

By [Insert Time], I set up an AI agent in Salesforce, signed up for an AgentForce-enabled organization, integrated external data using Data 360, and created a custom action to check in users at a resort organization.

---

### Weekly Summary

This week, I was introduced to the company, my team, and my supervisor, and I began familiarizing myself with Salesforce, a cloud-based platform for managing customer relationships and business processes. Using Trailhead, Salesforce's interactive online learning platform, I followed the AgentBlazer Trail to learn how to create AI agents—automated systems that assist users and perform tasks within Salesforce. I set up my development environment and attended daily meetings to provide updates and discuss tasks with the team and my supervisor. Throughout the week, I completed the Agent Planning Module, gaining knowledge about designing AI agents safely, including risk management, understanding deterministic and prompt-based actions, and mapping business processes to guide agent behavior. I applied these skills by setting up an AI agent, integrating external data with Data 360, and creating a custom action to check in users at a resort organization. Overall, the week provided me with practical experience in Salesforce development, AI agent creation, and understanding business process automation.

\`\`\``;
  
  return prompt;
}
