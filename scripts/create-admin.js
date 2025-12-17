// Script to create admin user via Supabase Admin API
// Run this with: node scripts/create-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const email = 'admin@zmai.pro';
  const password = 'Admin123456!';

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
      },
    });

    if (error) throw error;

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Details:');
    console.log('Email: admin@zmai.pro');
    console.log('Password: Admin123456!');
    console.log('\n🔐 Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdmin();
