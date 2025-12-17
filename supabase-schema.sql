-- ZoMail Pro Database Schema for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- This table is automatically managed by Supabase Auth, but we reference it

-- Lists table (CSV uploads)
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_count INTEGER DEFAULT 0,
  valid_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table (verified contacts)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  custom_fields JSONB,
  verified BOOLEAN DEFAULT false,
  verification_status TEXT, -- 'valid', 'invalid', 'risky', 'unknown'
  verification_date TIMESTAMP WITH TIME ZONE,
  list_id UUID REFERENCES lists(id),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  list_id UUID REFERENCES lists(id),
  status TEXT DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  total_sends INTEGER DEFAULT 0,
  successful_sends INTEGER DEFAULT 0,
  failed_sends INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Sends table (tracking individual email sends)
CREATE TABLE IF NOT EXISTS sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id),
  subscriber_id UUID REFERENCES subscribers(id),
  email TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'queued', 'delivered', 'bounce', 'dropped', 'deferred', 'processed'
  status_message TEXT,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  complaint BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  sendgrid_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for SendGrid API key, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_list_id ON subscribers(list_id);
CREATE INDEX IF NOT EXISTS idx_sends_campaign_id ON sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sends_subscriber_id ON sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_sends_status ON sends(status);
CREATE INDEX IF NOT EXISTS idx_sends_email ON sends(email);

-- Row Level Security (RLS)
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only authenticated admins can access
CREATE POLICY "Admin only access to lists" ON lists
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only access to subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only access to campaigns" ON campaigns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only access to sends" ON sends
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only access to settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sends_updated_at BEFORE UPDATE ON sends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
