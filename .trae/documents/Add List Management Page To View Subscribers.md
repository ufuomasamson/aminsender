I will add a "Manage" page for each list that displays the email addresses inside the list.

## Changes
- Add dynamic page `app/admin/lists/[id]/page.tsx` (client component):
  - Read `listId` from the URL.
  - Fetch subscribers for that list.
  - Render a table with `email`, `name`, `verification_status`, `subscribed_at`, `unsubscribed_at`.
  - Include basic search and count.
- Add API route `app/api/lists/[id]/subscribers/route.ts`:
  - Auth check with Supabase.
  - Return subscribers for the given `list_id`.
- Update lists page `app/admin/lists/page.tsx`:
  - Add a "Manage" button next to "Verify" that navigates to `/admin/lists/{id}`.

## Validation
- Build and run dev server.
- Open a list’s Manage page, confirm emails render correctly.
- Ensure RLS protects data (only authenticated admin can view).

I will implement these changes and verify the page end-to-end. 