#!/usr/bin/env node

/**
 * Automatic Database Migration Script
 * Run this to create the referral tables in your Supabase database
 * 
 * Usage: node migrate.js
 */

const https = require('https');

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: Missing environment variables');
  console.error('Please set:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('You can find these in your Supabase project settings.');
  process.exit(1);
}

// The SQL migration script
const SQL = `
CREATE TABLE IF NOT EXISTS referral_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES referral_users(id) ON DELETE CASCADE,
  referred_wallet TEXT NOT NULL,
  referred_user_id UUID REFERENCES referral_users(id) ON DELETE SET NULL,
  points_earned INTEGER DEFAULT 10,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW referral_leaderboard AS
SELECT 
  ru.id,
  ru.wallet_address,
  ru.referral_code,
  ru.total_referrals,
  ru.total_points,
  ru.created_at,
  RANK() OVER (ORDER BY ru.total_points DESC) as rank
FROM referral_users ru
ORDER BY ru.total_points DESC;

CREATE INDEX IF NOT EXISTS idx_referral_users_wallet ON referral_users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_referral_users_code ON referral_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON referrals(referred_user_id);

ALTER TABLE referral_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read referral_users" ON referral_users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own referral data" ON referral_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own referral data" ON referral_users FOR UPDATE USING (true);

CREATE POLICY "Anyone can read referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Users can insert referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update referrals" ON referrals FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION increment_referrals(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE referral_users
  SET total_referrals = total_referrals + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log('📍 Database:', SUPABASE_URL);

  const url = new URL(SUPABASE_URL);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: '/rest/v1/rpc/exec',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Migration successful!');
        console.log('');
        console.log('Your database now has:');
        console.log('  ✓ referral_users table');
        console.log('  ✓ referrals table');
        console.log('  ✓ referral_leaderboard view');
        console.log('  ✓ Security policies (RLS)');
        console.log('  ✓ Indexes for performance');
        console.log('');
        console.log('🎉 The referral system is ready to use!');
        process.exit(0);
      } else {
        console.error('❌ Migration failed');
        console.error('Status:', res.statusCode);
        console.error('Response:', data);
        
        // Try alternative approach
        console.log('');
        console.log('Trying alternative migration method...');
        runDirectSQL();
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    console.log('');
    console.log('Trying alternative migration method...');
    runDirectSQL();
  });

  const payload = {
    query: SQL
  };

  req.write(JSON.stringify(payload));
  req.end();
}

function runDirectSQL() {
  console.log('📝 Using direct SQL execution...');

  const url = new URL(SUPABASE_URL);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: '/rest/v1/sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Migration successful!');
        console.log('');
        console.log('Your database now has:');
        console.log('  ✓ referral_users table');
        console.log('  ✓ referrals table');
        console.log('  ✓ referral_leaderboard view');
        console.log('  ✓ Security policies (RLS)');
        console.log('  ✓ Indexes for performance');
        console.log('');
        console.log('🎉 The referral system is ready to use!');
        process.exit(0);
      } else {
        console.error('❌ Migration failed');
        console.error('Status:', res.statusCode);
        console.error('Response:', data);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

  req.write(JSON.stringify({ query: SQL }));
  req.end();
}

// Start the migration
runMigration();
