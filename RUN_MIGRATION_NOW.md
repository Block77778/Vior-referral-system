# 🚀 HOW TO RUN THE MIGRATION - SIMPLE STEPS

## The Easiest Way (2 minutes)

### Step 1: Open Your Supabase Dashboard
1. Go to https://supabase.com
2. Click your project name
3. You're now in your project dashboard

### Step 2: Click SQL Editor
Look at the **LEFT SIDEBAR** - you'll see:
```
🏠 Home
📊 SQL Editor  ← CLICK THIS
🔐 Authentication
📦 Storage
... etc
```

Click on **SQL Editor**

### Step 3: Create a New Query
You'll see a button at the top that says **"+ New Query"** or **"New"**

Click it. A blank text area appears.

### Step 4: Copy the SQL Script
1. Open this file in a new tab: `scripts/setup-referral-tables.sql`
2. Select **ALL** the text (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 5: Paste It Into Supabase
1. Click in the big empty text box in Supabase
2. Paste (Ctrl+V or Cmd+V)
3. You should see a bunch of SQL code

### Step 6: Run It
Look for the **Play Button** (▶️) at the top right of the text box.

Click it.

You'll see a notification at the bottom:
```
✅ Query succeeded (executed 1 of 1)
```

**DONE!** 🎉

---

## What Happened?

Your database now has:
- ✅ `referral_users` table (stores user accounts)
- ✅ `referrals` table (tracks who referred whom)
- ✅ `referral_leaderboard` view (shows top referrers)
- ✅ Security policies (RLS)
- ✅ Indexes (for speed)

---

## Verify It Worked

To double-check, run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'referral%';
```

You should see:
```
referral_users
referrals
```

If you see those, you're good! ✅

---

## What If It Fails?

### Error: "Table already exists"
That's fine! It means you already ran this. Skip to the next step.

### Error: "Permission denied"
You might need to use admin access. Check your Supabase settings.

### Error: "Syntax error"
Make sure you copied the ENTIRE file from `scripts/setup-referral-tables.sql`

---

## Next Steps

1. ✅ Migration complete
2. Open `REFERRAL_QUICKSTART.md`
3. Follow the 2 remaining steps
4. Done!

---

## Alternative: If You Can't Use Supabase Dashboard

**If Supabase dashboard isn't working**, use the CLI:

```bash
# If you have Node.js installed:
npx supabase db push scripts/setup-referral-tables.sql
```

Or ask your database admin to run the SQL file directly.

---

**That's it! You've set up your referral database.** 🚀

Next → Open `REFERRAL_QUICKSTART.md`
