# Environment Variables Setup

## What You Need

Your code needs **3 environment variables** to work:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
3. `NEXT_PUBLIC_APP_URL` - Your app's URL

## Where to Find Them

### Step 1: Go to Supabase Dashboard
https://supabase.com → Click your project

### Step 2: Get Your URL
1. Click **Settings** (bottom left)
2. Click **API**
3. Copy the **Project URL** (looks like: `https://xxxxxx.supabase.co`)
4. This is your `NEXT_PUBLIC_SUPABASE_URL`

### Step 3: Get Your Service Role Key
1. Still in **Settings** → **API**
2. Under **Service role** section
3. Copy the **Key** (starts with `eyJhbGc...`)
4. This is your `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Get Your App URL
If running locally:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If deployed on Vercel:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## How to Add Them to v0

Click on **Vars** in the left sidebar (or the gear icon), then:

1. Click **+ Add Variable**
2. Name: `NEXT_PUBLIC_SUPABASE_URL`
   Value: (paste your URL from Step 2)
   Public: YES (check the box)

3. Click **+ Add Variable**
2. Name: `SUPABASE_SERVICE_ROLE_KEY`
   Value: (paste your key from Step 3)
   Public: NO (leave unchecked)

4. Click **+ Add Variable**
   Name: `NEXT_PUBLIC_APP_URL`
   Value: (your app URL from Step 4)
   Public: YES (check the box)

## Quick Visual Summary

| Variable Name | Where to Get It | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | ✅ YES |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → Service Role Key | ❌ NO |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL | ✅ YES |

## After Adding Variables

1. Save
2. Refresh your app
3. Error should be gone!

## Need Help?

If you're stuck:
1. Make sure you're in the right Supabase project
2. Double-check you copied the values correctly
3. Make sure the variable names match exactly (case-sensitive)
