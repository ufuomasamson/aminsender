# Deployment Checklist for ZoMail Pro

Follow these steps to deploy ZoMail Pro:

## 1. Local Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 2. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor → Run the `supabase-schema.sql` file
4. Copy your credentials:
   - Project URL
   - Anon Key
   - Service Role Key
5. Go to Authentication → Enable Email provider
6. Create admin user:
   - Go to Users → Add User
   - Set email and password
   - Remember these credentials for login

## 3. SendGrid Setup

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create API Key with "Mail Send" permission
4. Copy the API key
5. Go to Settings → Sender Authentication
6. Set up domain authentication (SPF/DKIM/DMARC)
   - Follow the wizard in the app (Settings page)
   - Or see [SendGrid Docs](https://docs.sendgrid.com)

## 4. Environment Variables

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Hunter.io (Optional)
HUNTER_API_KEY=your_hunter_api_key

# Uploadthing (Optional - for image uploads)
UPLOADTHING_SECRET=your_uploadthing_secret
NEXT_PUBLIC_UPLOADTHING_URL=https://uploadthing.com
NEXT_PUBLIC_UPLOADTHING_KEY=your_uploadthing_key
```

## 5. Configure SendGrid Webhooks (Optional but Recommended)

1. Go to SendGrid → Settings → Mail Settings
2. Click on "Event Webhook"
3. Add webhook URL: `https://yourdomain.com/api/webhooks/sendgrid`
4. Select events to send:
   - delivered
   - open
   - click
   - bounce
   - dropped
   - unsubscribe
   - spamreport

## 6. Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENDGRID_API_KEY`
- `HUNTER_API_KEY` (optional)
- `UPLOADTHING_SECRET` (optional)
- `NEXT_PUBLIC_UPLOADTHING_URL` (optional)
- `NEXT_PUBLIC_UPLOADTHING_KEY` (optional)

## 7. Post-Deployment

1. Update SendGrid webhook URL to your production domain
2. Test login at `/admin/login`
3. Upload a test contact list
4. Send a test campaign
5. Check analytics

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Ensure all environment variables are set
- Check `package.json` scripts

### Database Errors
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure schema is created correctly

### Email Sending Issues
- Verify SendGrid API key
- Check SPF/DKIM/DMARC records
- Look at SendGrid activity logs

### Authentication Errors
- Verify admin user exists in Supabase
- Check middleware is working
- Clear browser cookies

## Security Notes

- Never commit `.env.local` to Git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Rotate API keys regularly
- Monitor SendGrid activity logs
- Keep complaint rate below 0.1%
