# Run Database Migration

## Option 1: Automatic (Easiest - 30 seconds)

If you have Node.js installed, run this command:

```bash
node migrate.js
```

That's it! The script will:
- Connect to your Supabase database
- Create all required tables
- Set up security policies
- Create indexes
- Show you success message

---

## Option 2: Manual via Supabase Dashboard (2 minutes)

If the script doesn't work:

1. Go to https://supabase.com → your project
2. Click **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Open file: `/scripts/setup-referral-tables.sql`
5. Copy all the SQL
6. Paste into Supabase
7. Click the **▶ Play button**
8. Wait for: `✅ Query succeeded`

---

## The Error You're Getting

```
Could not find the table 'public.referral_users'
```

This means the tables don't exist. Running either option above will fix it.

---

## After Migration

Once you see the success message:

1. ✅ Refresh your app
2. ✅ The error will be gone
3. ✅ Everything will work

---

## Still Not Working?

If you're still getting errors after the migration:

1. **Hard refresh** your browser (Ctrl+Shift+R)
2. **Wait 10 seconds**
3. **Try again**

Supabase sometimes takes a moment to update the schema cache.

---

**Choose Option 1 (automatic) if possible - it's the easiest!**
