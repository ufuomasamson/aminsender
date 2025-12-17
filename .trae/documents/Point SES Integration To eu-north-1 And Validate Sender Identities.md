I will point the app to your SES region (eu-north-1) so the Campaigns page fetches your verified sender identities correctly.

## Changes
- Update environment:
  - Set `AWS_REGION=eu-north-1` in `.env.local` (or add `AWS_SES_REGIONS=eu-north-1`).
- Restart the dev server to load new environment.

## Validation
- Call `GET /api/ses/identities` and confirm it returns identities from eu-north-1.
- Open Campaigns page; "Sender Email" dropdown should auto-populate with:
  - Verified email identities, and
  - Suggested addresses for verified domains (`noreply@`, `hello@`, `support@`, `contact@`).
- If SES is in sandbox, ensure the recipient is verified; otherwise use a verified address and send a test email from Settings.

## Notes
- No code changes needed beyond environment; multi-region discovery is already implemented.
- If you want identities from multiple regions, set `AWS_SES_REGIONS=eu-north-1,us-east-1`.

On approval, I will update the env, restart the server, and verify the identities and Sender Email population end-to-end.