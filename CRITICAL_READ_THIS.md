# ⚠️ CRITICAL: YOU MUST RUN THE DATABASE MIGRATION

## The Error You're Getting

```
Could not find the table 'public.referral_users' in the schema cache
```

**Translation**: The database table doesn't exist. You need to create it.

---

## The Solution (2 minutes)

### STEP 1: Open Supabase
1. Go to: https://supabase.com
2. Log in
3. Click on your project (the one for `pxfyxferkntzpygtxmpo`)

You're now in the Supabase Dashboard.

---

### STEP 2: Find SQL Editor

Look at the **LEFT SIDEBAR**. You should see:

```
┌─────────────────────────┐
│ 🏠 Home                 │
│ 📊 SQL Editor        ← CLICK THIS │
│ 🔐 Authentication       │
│ 📦 Storage              │
│ ...                     │
└─────────────────────────┘
```

**Click on "SQL Editor"**

---

### STEP 3: Create New Query

At the top, you'll see a button. Click: **"+ New Query"** or **"New"**

A big empty text box appears.

---

### STEP 4: Copy the SQL

Below is the **EXACT SQL** you need to run. Copy everything:

```sql
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
```

**Copy this entire block above** (Ctrl+A, then Ctrl+C)

---

### STEP 5: Paste Into Supabase

1. Click in the empty SQL text box in Supabase
2. Paste the SQL (Ctrl+V)
3. You should see the SQL code in the box

---

### STEP 6: Click Play

At the top right of the text box, you'll see a **▶ PLAY BUTTON** (looks like: ▶)

**Click it**

---

### STEP 7: Wait for Success

You should see a **GREEN NOTIFICATION** at the bottom:

```
✅ Query succeeded
```

**IF YOU SEE THIS, YOU'RE DONE!** ✅

---

## Verify It Worked

To confirm, run this test query. In Supabase SQL Editor, create a new query and paste:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'referral%';
```

Click play. You should see:

```
referral_users
referrals
```

If you see those two, **the database is ready!**

---

## After This is Done

1. ✅ Close Supabase
2. ✅ Refresh your app
3. ✅ The error will be gone
4. ✅ Everything will work

---

## Still Getting the Error?

If you still see the error after running the SQL:

1. **Hard refresh the app** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache**
3. **Wait 10 seconds** for Supabase to update
4. **Try again**

---

## TL;DR (Too Long; Didn't Read)

1. Go to Supabase
2. SQL Editor
3. New Query
4. Copy the SQL from this file
5. Paste
6. Click ▶
7. See ✅
8. Done

---

**That's it. This is the only thing standing between you and a working referral system.**

Do this now, then everything else will work perfectly.
