# Reflection

## 1. Hardest bug this week
The hardest bug was the Vercel deployment failure caused by 
useSearchParams() not being wrapped in a Suspense boundary. 
Locally everything worked fine — the bug only appeared in 
production build. 

My hypotheses were:
- Missing import somewhere
- Next.js version incompatibility  
- Build configuration issue

I read the exact error message carefully: "useSearchParams() 
should be wrapped in a suspense boundary at page /audit/results". 
Read Next.js docs and understood that production builds handle 
this differently than dev mode. Fixed by separating the component 
into ResultsContent and wrapping it in Suspense in the default export.

## 2. Decision I reversed mid-week
I initially used nanoid library for generating unique audit IDs. 
Installed it, wrote the code, worked fine locally. But when I ran 
the tests, they all failed with "Cannot use import statement outside 
a module" error.

After researching I found nanoid v5 is ESM-only which is incompatible 
with Jest's CommonJS environment. I reversed the decision and replaced 
it with a simple 6-line inline ID generator function. This actually 
taught me an important lesson — sometimes removing a dependency is 
better than adding complexity to support it.

## 3. What I would build in week 2
- Real Supabase integration for storing all audits, not just leads
- Resend email integration to actually send audit reports
- Dynamic OG image generation for shareable URLs
- Benchmark mode — "your AI spend per developer vs industry average"
- PDF export of the full audit report
- Better mobile experience

## 4. How I used AI tools
I used Claude (claude.ai) throughout this project for:
- Generating initial code structure and components
- Debugging errors I couldn't figure out quickly
- Writing the markdown documentation files
- Architecture decisions

What I didn't trust AI with:
- Pricing data — verified every number myself on vendor websites
- User interviews — had real conversations with real people
- DEVLOG entries — wrote from my actual daily experience
- Final debugging decisions — AI suggested wrong fixes sometimes

One specific time AI was wrong: Claude suggested using nanoid v4 
instead of v5 to fix the Jest ESM issue. I tried it and it still 
had problems. The real solution was to remove nanoid entirely and 
write an inline function — I figured this out myself.

## 5. Self ratings
**Discipline: 8.5/10** — Started well but first 2 days went into 
setup issues. Should have had a cleaner project setup from day 1.

**Code quality: 8/10** — TypeScript used properly throughout, 
audit engine is clean and readable, good separation of concerns 
between engine logic and UI.

**Design sense: 8/10** — The acid green + dark ink aesthetic is 
distinctive and professional. Results page is visually strong 
and screenshot-worthy.

**Problem solving: 8/10** — Solved every error that came up, 
never stayed stuck for too long. Vercel deployment issue and 
nanoid ESM issue both resolved independently.

**Entrepreneurial thinking: 7.5/10** — GTM and Economics docs are 
specific and realistic. User interviews gave genuine insights. 
Could have gone deeper on the business model.