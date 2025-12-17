I will fix the SES send payload and add preflight validation so sends don’t drop/bounce silently, and surface clear errors.

## Likely Causes
- Sandbox: sending to unverified recipients → drops/bounces.
- Sender not verified in eu-north-1.
- Invalid `FromEmailAddress` format (must be plain email, not `Display Name <...>`).
- Configuration set missing in region.

## Changes
1. Update SES send to use plain `FromEmailAddress` (email only) and keep `ReplyToAddresses`.
2. Add `getVerifiedDomains()` to check SES verified identities/domains in current region.
3. Preflight check in `sendCampaign`:
   - Ensure `sender_email` domain is verified (or exact email identity is verified) in region.
   - If not, return a clear error before sending.
4. Improve error logging:
   - Persist `status_message` from SES errors per send.
   - Return a summary to the UI: queued vs dropped counts and top error cause.
5. Update test-email route to use the corrected send and return structured errors.

## Validation
- Build and run dev server.
- Use a verified sender and (if sandbox) a verified recipient to send a test email.
- Check `sends` rows to confirm queued → delivered via SES SNS webhook. If error, see `status_message`.

I’ll implement these code changes and validate locally.