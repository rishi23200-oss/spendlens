# Dev Log

## Day 1 — 2026-05-07
**Hours worked:** 3
**What I did:** Set up the Next.js project from scratch. Created the folder structure, configured package.json, tsconfig.json, tailwind.config.ts, and postcss.config.js. Spent a lot of time fixing file placement issues — files were going into wrong directories.
**What I learned:** Next.js requires a very specific folder structure. The layout.tsx must export a valid React component as default export, otherwise the app crashes with "default export is not a React component". Also learned that .env.local must be at the project root, not inside src/app.
**Blockers / what I'm stuck on:** package.json was empty after creation — had to rewrite it manually via PowerShell. node_modules kept failing to install due to JSON parse errors.
**Plan for tomorrow:** Fix remaining structure issues, get npm install working cleanly, and start building the landing page.

## Day 2 — 2026-05-08
**Hours worked:** 2
**What I did:** Fixed the project structure completely — moved lib/, types/ to correct locations under src/. Got npm install working after rewriting package.json. Built the landing page with hero section, how-it-works section, and footer.
**What I learned:** PowerShell handles some commands differently than bash. The `move` command works differently — had to use specific paths. Also learned that Next.js 16 dropped the experimental serverActions flag.
**Blockers / what I'm stuck on:** Kept getting EJSONPARSE errors from npm because package.json had invalid content. Solved by using Set-Content to rewrite it completely.
**Plan for tomorrow:** Build the audit form, tool selector, and the core audit API route.

## Day 3 — 2026-05-09
**Hours worked:** 4
**What I did:** Built the full audit form with tool selector, plan/spend/seats inputs, and localStorage persistence. Built the audit engine with defensible rules for all 8 tools. Built the results page with savings hero, per-tool breakdown, AI summary fallback, lead capture, and share button. Wrote 6 passing tests for the audit engine.
**What I learned:** nanoid v5 is ESM-only and completely breaks Jest's CommonJS transform pipeline. Replaced it with a simple inline ID generator. Also learned that useSearchParams() in Next.js 16 must be wrapped in a Suspense boundary or the production build fails.
**Blockers / what I'm stuck on:** Vercel deployment failed with "useSearchParams should be wrapped in Suspense boundary" error — did not appear in local dev, only in production build.
**Plan for tomorrow:** Fix Vercel deployment, set up Supabase for lead storage, create all required markdown docs.

## Day 4 — 2026-05-10
**Hours worked:** 3
**What I did:** Fixed the Suspense boundary issue in results page. Fixed supabase.ts to handle missing env vars gracefully. Added all required markdown files — README, ARCHITECTURE, PRICING_DATA, PROMPTS, GTM, ECONOMICS, LANDING_COPY, METRICS, TESTS. Deployed successfully to Vercel.
**What I learned:** Vercel build hangs when environment variables are missing and the code doesn't handle undefined values gracefully. Always add fallback values for env vars in non-critical paths.
**Blockers / what I'm stuck on:** Vercel deployment was hanging for 20+ minutes — turned out to be a combination of the Suspense issue and missing env var handling.
**Plan for tomorrow:** Conduct 3 user interviews, write REFLECTION.md, complete DEVLOG, finalize CI workflow.


## Day 5 — 2026-05-11
**Hours worked:** 2
**What I did:** Added README.md with live deployment URL 
(https://spendlens-woad.vercel.app), added screenshots of landing page, 
audit form, and results page. Added CI workflow file. Verified full 
audit flow works on production — tested with Cursor Business 3 seats 
and found $60/mo savings correctly identified.
**What I learned:** Vercel automatically redeploys on every git push 
to main branch. Also learned that taking good screenshots matters — 
the results page screenshot shows the savings hero clearly which is 
what gets shared.
**Blockers / what I'm stuck on:** Need to complete user interviews — 
messaged 3 people today, waiting for responses.
**Plan for tomorrow:** Complete user interviews, write 
USER_INTERVIEWS.md, add DEVLOG Day 6.

## Day 6 — 2026-05-12
**Hours worked:** 2
**What I did:** Added CI workflow (.github/workflows/ci.yml), 
completed user interviews with 3 developers, wrote 
USER_INTERVIEWS.md. Verified all 6 tests still passing. 
Checked live site on mobile — responsive layout looks good.
**What I learned:** GitHub Actions CI runs automatically on 
every push to main. Green checkmark shows on commits which 
looks professional in the repo.
**Blockers / what I'm stuck on:** User interviews took time 
to schedule but got all 3 done today.
**Plan for tomorrow:** Final polish, complete DEVLOG Day 7, 
prepare submission.