import { Activity } from '@/lib/storage';
import { format, parseISO } from 'date-fns';

export async function generateDaySummaryPrompt(activities: Activity[], dayDate: string): Promise<string> {
  if (!activities || activities.length === 0) {
    return 'No activities recorded for this day.';
  }
  
  const date = parseISO(activities[0].time);
  const dayName = format(date, 'EEEE, MMMM d, yyyy');
  
  // Build the activities section
  let activitiesSection = `## ${dayName}\n`;
  activities.forEach(entry => {
    const entryTime = parseISO(entry.time);
    activitiesSection += `- ${format(entryTime, 'h:mm a')}: ${entry.activity}\n`;
  });
  
  const prompt = `I will provide you with a list of tasks I completed during a single day, formatted as follows:

${activitiesSection}

Your task is to:

1. Proofread all entries for grammar, spelling, and clarity.

2. Convert each task into the following format:
   * Start with the time (e.g., "By 9:30 AM"), followed by a pronoun ("I" or "we"), then the activity (e.g., "attended the stand-up meeting"), and a concise description of relevant details. Keep each activity clear and professional but not too long.

3. Write a concise daily summary in **one paragraph**, under 200 words, that:
   * Explains any technical tools used (assume the reader may not know them)
   * Summarizes your learning and accomplishments during the day
   * Reads professionally and is easy to understand

4. Generate all output in **Markdown format**, with activities in the time-first style, followed by the daily summary.

**Output format example in Markdown:**

\`\`\`markdown

### ${dayName}

By 9:30 AM, I attended the first team stand-up meeting of the year on Google Meet and was introduced to the team. We briefly reviewed ongoing projects and received a company briefing.

By 11:00 AM, I set up my development environment for Salesforce, including installing Salesforce DX (SFDX) and Visual Studio Code.

By 2:00 PM, I completed the initial setup tasks and began exploring the Salesforce Trailhead learning platform.

---

### Daily Summary

Today, I was introduced to the company and my team during the morning stand-up meeting. I spent the majority of the day setting up my development environment for Salesforce, a cloud-based platform for managing customer relationships and business processes. This included installing Salesforce DX (SFDX), which is a set of tools for Salesforce development, and configuring Visual Studio Code as my code editor. In the afternoon, I began exploring Trailhead, Salesforce's interactive online learning platform, to familiarize myself with the platform's capabilities and best practices. Overall, the day provided me with a solid foundation to begin working on Salesforce projects.

\`\`\`

Please format the activities and summary according to these guidelines.`;

  return prompt;
}

export async function generateWeekSummaryPrompt(weekActivities: { dayName: string; activities: Activity[] }[]): Promise<string> {
  if (!weekActivities || weekActivities.length === 0) {
    return 'No activities recorded for this week.';
  }
  
  // Build the activities section
  let activitiesSection = '';
  weekActivities.forEach(day => {
    activitiesSection += `\n### ${day.dayName}\n`;
    day.activities.forEach(entry => {
      const entryTime = parseISO(entry.time);
      activitiesSection += `- ${format(entryTime, 'h:mm a')}: ${entry.activity}\n`;
    });
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

---

### Weekly Summary

This week, I was introduced to the company, my team, and my supervisor, and I began familiarizing myself with Salesforce, a cloud-based platform for managing customer relationships and business processes. Using Trailhead, Salesforce's interactive online learning platform, I followed the AgentBlazer Trail to learn how to create AI agents—automated systems that assist users and perform tasks within Salesforce. I set up my development environment and attended daily meetings to provide updates and discuss tasks with the team and my supervisor. Throughout the week, I completed the Agent Planning Module, gaining knowledge about designing AI agents safely, including risk management, understanding deterministic and prompt-based actions, and mapping business processes to guide agent behavior. I applied these skills by setting up an AI agent, integrating external data with Data 360, and creating a custom action to check in users at a resort organization. Overall, the week provided me with practical experience in Salesforce development, AI agent creation, and understanding business process automation.

\`\`\`

Please format the activities and summary according to these guidelines.`;

  return prompt;
}
