# Admin Login Setup Guide

## Overview
ZoMail Pro uses Supabase Authentication for admin login. Only admins with valid Supabase Auth credentials can access the admin dashboard.

## Setting Up Your Admin Account

### Option 1: Create Admin User via Supabase Dashboard (Recommended)

1. **Login to Supabase**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your ZoMail Pro project

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add New User**
   - Click the "Add user" button (or "Invite user" for email confirmation)
   - Fill in the details:
     - **Email**: Your admin email (e.g., `admin@yourdomain.com`)
     - **Password**: Choose a strong password
   - Click "Create user"

4. **Email Confirmation (If Needed)**
   - If Email auth is enabled, you'll need to confirm the email
   - Click the confirmation link sent to your email
   - Or disable email confirmation in: Authentication → Settings → Email Auth → Enable email confirmations (turn OFF)

### Option 2: Create Admin User via SQL

If you prefer to create the admin user directly via SQL:

1. **Go to SQL Editor** in your Supabase project
2. **Run this SQL query**:

```sql
-- Create admin user
-- Replace with your desired email and password
SELECT auth.users.insert(json_build_object(
  'email', 'admin@yourdomain.com',
  'encrypted_password', crypt('your_password_here', gen_salt('bf')),
  'email_confirmed_at', NOW(),
  'raw_app_meta_data', json_build_object(
    'provider', 'email',
    'providers', array['email']
  )
));
```

**Note**: Replace:
- `admin@yourdomain.com` with your admin email
- `your_password_here` with your desired password

### Option 3: Use Supabase Auth Directly in Your App

You can also use the Supabase JS client to create users programmatically in your app (for initial setup only).

## Testing Your Login

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to login page**
   - Open http://localhost:3001/admin/login

3. **Enter credentials**
   - Use the email and password you created

4. **You should be redirected to** `/admin/dashboard`

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find these in:
- Supabase Dashboard → Project Settings → API

## Troubleshooting

### "Invalid login credentials"
- Make sure the user exists in Supabase Auth
- Check that email confirmation is disabled (or confirm your email)
- Verify environment variables are correct

### "Email not confirmed"
- Go to Authentication → Settings
- Turn OFF "Enable email confirmations"
- Or click the confirmation link in your email

### Can't create user
- Ensure Supabase Auth is enabled
- Check that Email provider is enabled in Authentication → Providers
- Verify your project is active

## Security Notes

1. **Only create ONE admin user** for ZoMail Pro
2. **Use a strong password** (12+ characters, mix of letters, numbers, symbols)
3. **Don't share credentials** in version control
4. **Consider 2FA** for production (via Supabase)

## Multiple Admins (Advanced)

If you need multiple admins, create additional users in Supabase. All authenticated users can access the admin area (the middleware checks for authentication, not specific roles).

To add role-based access control:
1. Add a `role` column to the users table
2. Modify the middleware to check roles
3. Only allow `admin` role users to access

## Quick Setup Commands

If you want to test immediately without setting up Supabase:

1. **Temporarily disable auth check** in `middleware.ts`:
   ```typescript
   // Comment out the auth check for testing
   // if (!user) {
   //   return NextResponse.redirect(new URL('/admin/login', request.url));
   // }
   ```

   ⚠️ **WARNING**: Only do this for local testing. Remove this before deploying to production!

## Production Setup

For production:
1. Always confirm email addresses
2. Enable password requirements
3. Set up proper backup admin accounts
4. Monitor authentication logs in Supabase
5. Consider OAuth providers (Google, GitHub, etc.)

---

Need help? Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
