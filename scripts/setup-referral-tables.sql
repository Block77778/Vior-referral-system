-- Create users table for referral system
CREATE TABLE IF NOT EXISTS referral_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create referrals table to track who referred whom
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES referral_users(id) ON DELETE CASCADE,
  referred_wallet TEXT NOT NULL,
  referred_user_id UUID REFERENCES referral_users(id) ON DELETE SET NULL,
  points_earned INTEGER DEFAULT 10,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboard view
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_users_wallet ON referral_users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_referral_users_code ON referral_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON referrals(referred_user_id);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE referral_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read referral_users" ON referral_users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own referral data" ON referral_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own referral data" ON referral_users FOR UPDATE USING (true);

CREATE POLICY "Anyone can read referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Users can insert referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update referrals" ON referrals FOR UPDATE USING (true);

-- Create a function to safely increment referrals count
CREATE OR REPLACE FUNCTION increment_referrals(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE referral_users
  SET total_referrals = total_referrals + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
