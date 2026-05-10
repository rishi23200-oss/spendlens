# Metrics

## North Star Metric
**Audit completions per week**

Why: An audit completion means a user provided real data and received real value. 
It's the moment value is exchanged. Everything upstream (traffic, conversion) and 
downstream (email capture, consultations) flows from this number. DAU is wrong for 
a tool people use once a quarter; revenue is too lagging for early stage.

## 3 Input Metrics That Drive the North Star

1. **Landing page → audit start rate** (target: >40%)
   If this is low, the headline/CTA isn't landing. Fix: copy, social proof, or load time.

2. **Audit start → completion rate** (target: >70%)
   If this is low, the form has too much friction. Fix: reduce fields, improve UX, persist state better.

3. **Organic referral traffic from shared audit URLs** (target: >20% of total traffic)
   Each shared audit URL is a free acquisition channel. If this is low, the results page 
   isn't compelling enough to share — fix the visual design and savings presentation.

## What to Instrument First
1. Audit completion event (with total spend, savings amount, tools used)
2. Email capture conversion (did they submit after seeing results?)
3. Share button clicks
4. Consultation CTA clicks (for >$500/mo savings cases)

Use PostHog or Plausible — both have generous free tiers and are privacy-friendly 
(important for a tool handling financial data).

## Pivot Trigger
If **audit start → completion rate drops below 40%** for two consecutive weeks, 
the form is broken or the ICP is wrong. Either simplify the form to 3 fields 
(tools, spend, team size) or reconsider the audience.

If **email capture rate drops below 15%** of completions, the results page isn't 
delivering perceived value. The audit logic or UI needs work before more acquisition spend.