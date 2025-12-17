## Tasks
1. Add KPI cards: Open Rate, Click Rate, Bounce Rate, Complaint Rate.
2. Add “Recent Sends” table with latest 20 sends.
3. Add timeframe filter for dashboard (7/30/90 days) via search param.
4. Add CSV export APIs for sends and lists and hook buttons.
5. Build and verify UI and metrics.

## Approach
- Update the dashboard server component to accept `searchParams.days`, compute send metrics within range, and optimize counts using `head: true, count: 'exact'`.
- Add a small client chart already in place; add export buttons and recent sends section.
- Create `/api/dashboard/export/sends` (text/csv) and `/api/dashboard/export/lists` APIs.

I’ll implement these changes and validate locally.