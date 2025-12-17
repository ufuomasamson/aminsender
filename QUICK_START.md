# 🚀 ZoMail Pro Quick Start Guide

## Step-by-Step Setup (5 Minutes)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - **Name**: ZoMail Pro
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
4. Wait for project to initialize (1-2 minutes)

### 3️⃣ Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### 4️⃣ Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Find "Email" provider
3. Make sure it's **Enabled**
4. Click **Settings**
5. **Disable** "Confirm email" (uncheck the box)
6. Click "Save"

### 5️⃣ Create Admin User

**Option A: Via Dashboard (Easiest)**

1. Go to **Authentication** → **Users**
2. Click **"Add user"** button (top right)
3. Fill in:
   - **Email**: `admin@example.com` (or your email)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ Check this
4. Click **"Create user"**
5. ✅ Done! Your admin credentials are ready

**Option B: Via SQL (Advanced)**

1. Go to **SQL Editor**
2. Run this (replace email and password):
```sql
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

### 6️⃣ Get Your Environment Variables

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **⚠️ Keep this secret!**

### 7️⃣ Create `.env.local` File

In your project root, create `.env.local`:

```env
# Supabase (from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# SendGrid (get from sendgrid.com → Settings → API Keys)
SENDGRID_API_KEY=SG.your_sendgrid_key_here

# Optional: Hunter.io for email verification
HUNTER_API_KEY=your_hunter_key_here
```

### 8️⃣ Test Your Setup

```bash
npm run dev
```

Open http://localhost:3001/admin/login and try logging in with your admin credentials!

---

## 🎉 You're Done!

- **Homepage**: http://localhost:3001
- **Admin Login**: http://localhost:3001/admin/login
- **Admin Dashboard**: http://localhost:3001/admin/dashboard (after login)

## 📚 Next Steps

1. **Setup SendGrid** (Optional - for sending emails):
   - Get API key from sendgrid.com
   - Add to `.env.local`
   - See `ADMIN_SETUP.md` for SendGrid configuration

2. **Upload Contacts**:
   - Go to Lists page
   - Upload a CSV file with emails

3. **Create Campaign**:
   - Go to Campaigns page
   - Design and send your first email!

## ❗ Troubleshooting

### Can't login?
- Make sure email confirmation is disabled
- Check `.env.local` has correct Supabase credentials
- Verify the user exists in Supabase → Authentication → Users

### Port already in use?
- The dev server will automatically try port 3001
- Or kill the process using port 3000

### Database errors?
- Make sure you ran `supabase-schema.sql`
- Check Supabase dashboard for errors

---

**Need more help?** See `ADMIN_SETUP.md` for detailed instructions.
