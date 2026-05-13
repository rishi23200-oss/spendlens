# USER INTERVIEWS

Three conversations conducted on 2026-05-09. Each was 10–15 minutes via WhatsApp/call with college connections who are actively job searching and using AI tools for projects and resumes.

---

## Interview 1

**Name:** Kanhaiya Kumar Jha
**Role:** Recent graduate, actively job searching
**Company stage:** Pre-employment — building portfolio projects

### Notes

Kanhaiya uses ChatGPT Free, Claude Free, Gemini Pro (free tier), and Perplexity Free for resume writing, project documentation, and research. He has never paid for any AI tool subscription and actively switches between tools depending on the task.

**Direct quotes:**

> "I use ChatGPT for resume drafts, Perplexity for research, Gemini for cover letters — all free. I just switch tabs depending on what works better."

> "I tried Claude once for a project — the output was noticeably better for writing, but I didn't know there was a free tier. I thought it was paid only."

> "If a tool told me which free AI is best for my exact use case, I'd use it immediately. Right now I'm just guessing."

**Most surprising thing:** Gautam was running 4 different AI tools simultaneously in separate tabs and manually comparing outputs — with zero awareness that Claude Free exists and outperforms ChatGPT Free for writing tasks. He assumed Claude was paid-only.

**What it changed about the design:** I added a "free tier recommendation" layer to the audit results — even for zero-spend users, the tool now suggests which free tier fits their use case best. This segment is real and large.

---

## Interview 2

**Name:** Adtiya Kumar
**Role:** Recent graduate, job searching
**Company stage:** Pre-employment — working on portfolio projects

### Notes

Adtiya uses Claude Free, ChatGPT Free, GitHub Copilot Free, and occasionally Gemini for coding help on personal projects. He paid for Claude Pro for one month and cancelled after finding the free tier sufficient for his usage volume.

**Direct quotes:**

> "I had Claude Free and ChatGPT Free open in two tabs — when one hit the message limit I'd switch to the other. It was annoying but it worked."

> "I bought Claude Pro once. It felt like $20 wasted because I couldn't use it enough to justify it. I cancelled after a month."

> "Copilot Free is good enough for what I do — I don't think I need the paid version yet."

**Most surprising thing:** He had already self-diagnosed his overspend problem — paid for Pro, recognized he didn't use it enough, and cancelled. He had done exactly what SpendLens would recommend, but only after wasting $20 and a month of uncertainty.

**What it changed about the design:** Rishikesh's story validated the core audit concept at the individual level. I strengthened the audit engine's logic for Claude Pro — it now explicitly flags single users who aren't hitting daily message limits and recommends staying on Free, with a one-sentence reason: "Pro is designed for users who exhaust Free limits daily."

---

## Interview 3

**Name:** Prince Kumar
**Role:** Recent graduate, job searching + occasional freelance work
**Company stage:** Pre-employment — freelance client projects on the side

### Notes

Prince uses Gemini Pro (via Google One trial), ChatGPT Free, Perplexity Free, and Claude Free for freelance project proposals, client communication drafts, and general research. He has not paid directly for any AI tool but is on an active trial.

**Direct quotes:**

> "I use Gemini the most — it came with my Google One trial so it felt free. I didn't think about what happens when the trial ends."

> "Perplexity is my go-to for research. The free version is genuinely good — I don't see a reason to pay."

> "ChatGPT, Claude, Gemini, Perplexity — I have all of them bookmarked. I pick based on the task. It's a bit chaotic honestly."

**Most surprising thing:** Suresh had no idea his Google One trial was about to auto-convert to a paid subscription. He was about to be charged for Gemini Pro without realizing it — a completely accidental spend scenario that had nothing to do with conscious tool selection.

**What it changed about the design:** I added a Gemini-specific audit note: "If you started on a Google One trial, verify your billing status — trials auto-convert to paid subscriptions without a clear warning." This is a small but high-value flag that Suresh's interview surfaced directly. It also broadened my thinking about the tool's value proposition — it's not just about optimising conscious spend, it's also about catching accidental spend before it happens.