-- Create Admin User for ZoMail Pro
-- Run this in Supabase SQL Editor

-- First, let's create the user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@zmai.pro',
  crypt('Admin123456!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}'
);

-- Verify the user was created
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@zmai.pro';
