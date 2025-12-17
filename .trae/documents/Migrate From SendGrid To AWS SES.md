I will migrate the bulk email sender from SendGrid to AWS SES and keep all existing features (campaigns, lists, analytics, unsubscribe) working.

## Scope
- Remove SendGrid code and dependency.
- Add AWS SES SDK and implement sending + identity listing.
- Replace SendGrid webhook with SES SNS handler for bounces/complaints/delivery.
- Update UI (Settings & Campaigns) and docs.

## Changes
1. Dependencies
- Remove `@sendgrid/mail`.
- Add `@aws-sdk/client-sesv2`.

2. Environment
- Add `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- Optional: `AWS_SES_CONFIGURATION_SET`.

3. Email Library
- New `lib/ses.ts`:
  - `sendEmail()` and `sendBulkEmail()` using `SESv2 SendEmailCommand`.
  - Append unsubscribe footer and plain-text variant.
  - Graceful errors when env missing.

4. Server Actions
- Update `app/actions/campaigns.ts` to import and use SES `sendBulkEmail()` with current throttling.

5. Sender Identities API
- Replace `app/api/sendgrid/domains/route.ts` with `app/api/ses/identities/route.ts`:
  - Use `ListEmailIdentities` to return verified emails; for verified domains, synthesize common addresses (`noreply@`, `hello@`, `support@`).
  - Include `settings.sender_email` if present.

6. Webhooks
- Remove `app/api/webhooks/sendgrid/route.ts`.
- Add `app/api/webhooks/ses/route.ts` to receive AWS SNS notifications:
  - Handle `Delivery` → mark `delivered`.
  - Handle `Bounce` → mark `bounce`.
  - Handle `Complaint` → mark `complaint` and optionally unsubscribe.

7. UI Updates
- Settings (`app/admin/settings/page.tsx`):
  - Replace SendGrid UI with AWS SES configuration and guidance (domain verification, DKIM via Route53, DMARC, SPF include: `amazonses.com`).
  - Test email button wired to SES.
- Campaigns (`app/admin/campaigns/page.tsx`):
  - Fetch sender emails from `/api/ses/identities`.
  - Update helper text to SES.

8. Docs
- Update `README.md` and `PROJECT_SUMMARY.md` to reference AWS SES, new env vars, setup steps (verify domain, configure SNS to webhook URL).

9. Cleanup
- Delete `lib/sendgrid.ts` and `app/api/sendgrid/*`.

## Verification
- Build and run dev server.
- Ensure campaigns page loads SES identities without keys (graceful fallback).
- Simulate a campaign send (will throw if keys absent; UI guards).
- Confirm webhook route parses SNS example payloads and updates `sends` table mapping.

I will implement these changes and validate locally. Please provide the AWS keys when ready; the code will read them from environment variables.