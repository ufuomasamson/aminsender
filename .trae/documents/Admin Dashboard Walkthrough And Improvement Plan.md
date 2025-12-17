## Current Design
- **Server Component** (`app/admin/dashboard/page.tsx:6`)
  - Creates a server-side Supabase client (`app/admin/dashboard/page.tsx:7`) and queries four tables.
  - Queries:
    - `subscribers` IDs for count (`app/admin/dashboard/page.tsx:10`)
    - `sends` statuses for success/failure metrics (`app/admin/dashboard/page.tsx:11`)
    - Latest 3 `campaigns` (`app/admin/dashboard/page.tsx:12`)
    - Top 5 `lists` (`app/admin/dashboard/page.tsx:13`)
  - Computes metrics client-side:
    - `totalSubscribers` (`app/admin/dashboard/page.tsx:15`)
    - `successfulSends` and `failedSends` by filtering `sends` (`app/admin/dashboard/page.tsx:16–17`)
    - `inboxRate` from delivered vs total (`app/admin/dashboard/page.tsx:18–20`)
  - Renders:
    - Metric cards (`app/admin/dashboard/page.tsx:41–69`)
    - Quick action cards to Lists/Campaigns/Verify (`app/admin/dashboard/page.tsx:72–95`)
    - Chart placeholder (“Send Performance”) for last 7 days (`app/admin/dashboard/page.tsx:99–114`)
    - Recent campaigns list (`app/admin/dashboard/page.tsx:116–149`)
    - Lists overview with valid rate (`app/admin/dashboard/page.tsx:151–206`)

- **Data Sources & Events**
  - Deliverability depends on `sends.status` which is updated by SES SNS webhook (`app/api/webhooks/ses/route.ts:1`).
  - Analytics route already aggregates metrics if needed (`app/api/analytics/route.ts:4–50`).

- **Strengths**
  - Simple, server-rendered dashboard — no client fetches, quick actions easy to discover.
  - Supabase queries are straightforward and respect RLS.

- **Limitations**
  - **Counting**: `select('id', { count: 'exact' })` returns `count`, but the code uses `data.length` (`app/admin/dashboard/page.tsx:15`), incurring unnecessary data transfer.
  - **Aggregation**: Filters `sends` client-side; better done via SQL aggregation.
  - **Chart**: Placeholder only; no time-bucketed sends/open/click series.
  - **Timeframe**: Metrics are lifetime totals; no range filters (last 7/30 days).
  - **Performance**: Multiple queries without caching; no ISR/revalidate.
  - **UX**: No empty-state guidance to set up SES identities; no surface of bounce/complaint rates.

## Improvement Plan
1. **Aggregate Metrics in SQL**
   - Replace `sends` filtering with a single grouped query: counts by status and time buckets.
   - Use `count` response from Supabase for subscribers/lists to avoid transferring rows.
2. **Chart: Sends Over Time**
   - Add real chart (Recharts already in deps) with daily counts for `delivered`, `bounce`, `complaint` over the last 7/30 days.
   - Endpoint: add `/api/dashboard/metrics` returning series + totals (or reuse `app/api/analytics/route.ts` and extend it).
3. **Timeframe Filters**
   - UI toggle for 7/30/90 days; persist in query string; server component re-runs with selected range.
4. **Deliverability KPIs**
   - Additional metric cards: `Open Rate`, `Click Rate`, `Bounce Rate`, `Complaint Rate` using fields from `sends` (`opened`, `clicked`, `status`).
5. **SES Setup Nudge**
   - If `/api/ses/identities` returns empty, show a dashboard banner linking to Settings with steps to verify domain/email.
6. **Performance & Caching**
   - Add `export const revalidate = 60` to the dashboard for ISR caching of expensive queries.
   - Use `select('*', { head: true, count: 'exact' })` when only counts are needed.
7. **Recent Activity**
   - Add “Recent Sends” table: latest 20 sends with status, email, campaign.
   - Link each campaign to detail page; each list to its Manage page.
8. **Error Handling**
   - Wrap Supabase queries in try/catch; show friendly error states if any query fails.

## Deliverables
- New/updated API route(s) for aggregated metrics and time-bucketed series.
- Dashboard UI enhancements (filters, charts, extra KPIs, setup banner).
- Query optimizations and caching for performance.

On approval, I will implement these dashboard improvements, wire them to existing data, and validate with test data.