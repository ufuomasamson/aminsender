I will start the development server and run a quick validation of the AWS SES setup.

## Pre‑flight Checks
- Confirm required env vars are present: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, Supabase keys.
- Ensure domain/sender is verified in SES (sandbox requires verified recipients).

## Actions
1. Start the app: `npm run dev`.
2. Open the app at `http://localhost:3000`.
3. Validate SES identities API:
   - Call `GET /api/ses/identities` and ensure it returns addresses.
4. Send a test email:
   - Use Settings page “Send Test” to trigger `POST /api/test-email`.
   - Confirm no server errors in the console.
5. Basic campaign flow check:
   - Create a small test list and campaign, trigger send; verify records in `sends` table update to `queued` and then, after SES delivery, SNS webhook can update statuses.

## Post‑validation
- If identities don’t appear, re‑check SES verification and region.
- If sends fail, confirm IAM permissions include `ses:SendEmail` and that your account is in production (or recipient is verified in sandbox).
- Optional: set up SNS topics and subscribe HTTPS webhook to `/api/webhooks/ses` for Delivery/Bounce/Complaint updates.

I’ll proceed to run the server and execute these checks now.