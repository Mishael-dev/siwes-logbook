
'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { format, parseISO } from "date-fns";
import { getWeekEntry } from "@/lib/storage"; 


export type SummaryResponse = {
  prompt: string;
  content: string | null;
  error?: string;
};

export async function generateWeekSummary(weekNumber: number, year: number): Promise<SummaryResponse> {
  const weekEntry = await getWeekEntry(weekNumber, year);

  if (!weekEntry || weekEntry.entries.length === 0) {
    return { 
      prompt: "", 
      content: "No activities recorded for this week." 
    };
  }

  let activitiesSection = ``;
  weekEntry.entries.forEach((entry) => {
    const date = parseISO(entry.time);
    activitiesSection += `- ${format(date, "EEEE, MMM d")} | ${format(date, "h:mm a")}: ${entry.activity}\n`;
  });

  const prompt = `
You are a professional synthesizer. I will provide you with a raw list of my daily tasks for Week ${weekNumber} of ${year}.

Your goal is to convert these raw notes into a professional Weekly Report using **clean, strict Markdown** formatted for a React Markdown renderer.

Here is the raw data:
${activitiesSection}

---

### INSTRUCTIONS

**Part 1: Daily Breakdown**
* Group the raw data by Day (e.g., ## Monday).
* Use a standard bulleted list for entries.
* Format each line strictly as: **"By [Time], I [Action]..."** (e.g., "By 9:30 AM, I attended the stand-up meeting...").
* Ensure there is a blank line between each day's section for clean rendering.

**Part 2: Weekly Summary**
* Create a section titled **### Weekly Summary**.
* Write **one single paragraph** (approx. 200-300 words).
* **Crucial:** Blend "What I Did" and "What I Achieved" into a cohesive narrative.
    * Connect the *action* (e.g., "I used Salesforce...") directly with the *outcome* (e.g., "...to successfully map the agent workflow").
    * Explain technical tools briefly if mentioned.

**Part 3: Suggested Diagrams**
* Create a final section titled **### Suggested Diagrams**.
* Based strictly on the activities above, suggest 1-3 specific diagrams that would visualize the work (e.g., Flowcharts, ERDs, Sequence Diagrams).
* Format the list as:
  * **[Diagram Type]**: [Brief description of what to visualize]
* If the work was non-technical, suggest a timeline or process map.

**Output Rules:**
* **Return ONLY the Markdown.** No opening text ("Here is your report") and no closing notes.
* Use standard Markdown headers (##, ###) and lists (-).
* Do not use code blocks (\`\`\`) to wrap the output; just return the raw Markdown text.
`;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return { prompt, content: null, error: "API Key Missing" };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      prompt: prompt,
      content: response.text()
    };
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      prompt: prompt,
      content: null,
      error: "Failed to generate report"
    };
  }
}