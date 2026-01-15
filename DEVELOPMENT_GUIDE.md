# SIWES Logbook - Development Guide

## 🚨 IMPORTANT: Branch Strategy

### Always Push To: `roblo's-branch`

**NEVER push directly to `master`**

```bash
# Before making changes
git checkout roblo's-branch
git pull origin roblo's-branch

# After making changes
git add .
git commit -m "Your commit message"
git push origin roblo's-branch
```

## 🌐 Vercel Preview Deployments

### How It Works
- Every push to `roblo's-branch` triggers an automatic preview deployment
- You get a unique URL like: `https://siwes-logbook-git-roblos-branch-yourteam.vercel.app`
- Only merges to `master` update the production site

### Testing Your Changes
1. Push to `roblo's-branch`
2. Go to your GitHub repository → Pull Requests
3. Vercel bot will comment with the preview URL
4. Test thoroughly on the preview URL
5. Only merge to `master` when everything works

### Alternative: Check Vercel Dashboard
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Find your project
- Click on the latest deployment
- Copy the preview URL

## ✨ New Features Implemented

### 1. Edit Activities from Different Days
- Navigate to any week view
- Click the **edit icon** (✏️) next to any activity
- Modify the text and save
- Changes are saved to the database immediately

### 2. Daily AI Summary Generation
- On the week details page, each day has a "Day Summary" button
- Click it to generate a professional summary for that specific day
- The AI will format activities and create a daily summary paragraph

### 3. Weekly AI Summary Generation
- The main "Generate Weekly Summary" button at the bottom
- Generates a comprehensive summary for the entire week
- Includes all days with activities formatted professionally

### 4. Delete Activities
- Click the **trash icon** (🗑️) next to any activity
- Confirm deletion
- Activity is removed from the database

## 🏗️ Files Modified/Created

### New Components
- `/components/EditActivityModal.tsx` - Modal for editing activities
- `/components/SummaryModal.tsx` - Modal for displaying AI summaries
- `/lib/ai-summary.ts` - AI prompt generation logic

### Updated Files
- `/app/activities/week/[year]/[week]/page.tsx` - Week details with edit/delete/summary features

### Existing Files (No Changes Needed)
- `/app/actions/activity.ts` - Already had update/delete functions
- `/components/ActivityList.tsx` - Already had edit/delete UI

## 🎯 How to Use the New Features

### Editing an Activity
1. Go to Activities → Select a week
2. Find the activity you want to edit
3. Click the edit icon (✏️)
4. Update the text in the modal
5. Click "Save Changes"

### Generating Daily Summary
1. Go to Activities → Select a week
2. Find the day you want to summarize
3. Click "Day Summary" button next to the day header
4. Click "Generate Summary" in the modal
5. Copy the generated text for your logbook

### Generating Weekly Summary
1. Go to Activities → Select a week
2. Click "Generate Weekly Summary" at the bottom
3. Click "Generate Summary" in the modal
4. Copy the generated text for your logbook

## 🔧 Next Steps (Future Improvements)

### Integrate Real AI API
Currently, the summary generation shows the prompt. You need to:
1. Set up an AI API (OpenAI, Anthropic, etc.)
2. Add API key to environment variables
3. Update `/lib/ai-summary.ts` to call the API
4. Return the actual AI-generated summary

Example API integration:
```typescript
// In lib/ai-summary.ts
export async function callAIAPI(prompt: string): Promise<string> {
  const response = await fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data.summary;
}
```

### Create API Route
```typescript
// app/api/ai-summary/route.ts
export async function POST(req: Request) {
  const { prompt } = await req.json();
  // Call your AI service here
  // Return the generated summary
}
```

## 📝 Commit Message Template

When pushing changes, use clear commit messages:

```bash
git commit -m "feat: add edit functionality for historical activities"
git commit -m "feat: add daily and weekly AI summary generation"
git commit -m "fix: prevent summary modal from closing while generating"
git commit -m "style: improve edit modal UI responsiveness"
```

## 🐛 Troubleshooting

### Preview Not Updating?
- Clear browser cache
- Check Vercel dashboard for build errors
- Ensure you pushed to the correct branch

### Edit/Delete Not Working?
- Check browser console for errors
- Verify Supabase connection
- Check user authentication status

### Summary Generation Slow?
- Normal for first generation (cold start)
- Consider adding loading states
- Implement caching for repeated requests

---

**Remember: Always push to `roblo's-branch` and test on Vercel preview before merging to master!**
