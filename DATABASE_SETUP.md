# 🗄️ Database Setup - REQUIRED STEP

## ⚠️ IMPORTANT: You Must Run This Migration

The referral system requires database tables that don't exist yet. Follow these steps to set them up.

---

## Option 1: Supabase Dashboard (Recommended)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Sign in to your project
3. Navigate to your project

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query** button

### Step 3: Copy the Migration Script
1. Open: `/scripts/setup-referral-tables.sql`
2. Copy **ALL** the contents

### Step 4: Paste and Run
1. Paste into the SQL Editor in Supabase
2. Click the **Play** (▶) button or press `Ctrl+Enter`
3. Wait for the query to complete
4. You should see: **"Query succeeded"**

### Step 5: Verify
Run this query to confirm tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'referral%';
```

You should see:
- `referral_users`
- `referrals`

---

## Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or manually run the SQL
supabase db push scripts/setup-referral-tables.sql
```

---

## Option 3: Direct Database Connection

If you have direct database access:

```bash
# Using psql
psql postgresql://user:password@host/database < scripts/setup-referral-tables.sql

# Or paste the SQL directly in your database client
```

---

## What Gets Created

### Tables
- **`referral_users`** - Stores user accounts and points
- **`referrals`** - Records referral relationships

### Views
- **`referral_leaderboard`** - Rankings by points

### Functions
- **`increment_referrals()`** - Safe counter function

### Policies (RLS)
- Public read access to leaderboard
- Insert/update permissions for API

### Indexes
- `idx_referral_users_wallet` - Fast user lookup
- `idx_referral_users_code` - Fast code lookup
- `idx_referrals_referrer` - Fast referrer lookup
- `idx_referrals_referred_user` - Fast referred user lookup

---

## Verification

After running the migration, verify with these queries:

### Check tables exist
```sql
SELECT * FROM referral_users LIMIT 1;
SELECT * FROM referrals LIMIT 1;
SELECT * FROM referral_leaderboard LIMIT 1;
```

### Check functions exist
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'increment_referrals';
```

### Check indexes exist
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('referral_users', 'referrals');
```

---

## Troubleshooting

### Error: "Could not find table 'referral_users'"
**Solution**: You haven't run the migration yet. Follow steps above.

### Error: "Permission denied"
**Solution**: Make sure you're using a role with CREATE TABLE permissions
- Use service role key (not anon key)
- Use a user with admin permissions

### Error: "Function increment_referrals already exists"
**Solution**: That's OK! The function might exist. Drop it first:
```sql
DROP FUNCTION IF EXISTS increment_referrals(uuid);
-- Then run the migration again
```

### Error: "RLS policy already exists"
**Solution**: Same as above, the policies exist. You can safely drop and recreate:
```sql
DROP POLICY IF EXISTS "Anyone can read referral_users" ON referral_users;
-- Then run the migration again
```

---

## After Running Migration

Once the migration is complete:

1. ✅ Database is ready
2. ✅ Referral system will work
3. ✅ No more "table not found" errors
4. ✅ You can start using the system

---

## Connection Issues?

If you get connection errors, verify your environment variables:

```bash
# These must be set:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Next Steps

After running this migration:

1. ✅ Database setup complete
2. Open `REFERRAL_QUICKSTART.md`
3. Follow the remaining 2 steps
4. Test the system
5. Deploy!

---

**Status**: Once you run this migration, move to `REFERRAL_QUICKSTART.md` for testing.

**Need Help?** See `REFERRAL_IMPLEMENTATION.md` → Troubleshooting
