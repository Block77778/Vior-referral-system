# Referral System Implementation Checklist

## ✅ What's Been Implemented

### 1. **Cookie-Based Referral Capture**
- ✅ Updated `/components/referral-capture.tsx`
- ✅ Captures `ref` parameter from URL on first visit
- ✅ Stores in cookie (not localStorage) with 30-day expiration
- ✅ Doesn't overwrite existing referral cookies

### 2. **Backend Account Creation with Referral**
- ✅ Created `/app/api/referral/create-user/route.ts`
- ✅ Validates wallet address format
- ✅ Creates user account if new
- ✅ Processes referral if referrer code is valid
- ✅ Prevents self-referrals
- ✅ Awards points to referrer (100 points)
- ✅ Gives bonus to new user (25 points)
- ✅ Records referral in database with status

### 3. **Wallet Integration**
- ✅ Updated `/components/wallet-context.tsx`
- ✅ Calls create-user API on wallet connect
- ✅ Automatically reads referral code from cookie
- ✅ Clears cookie after successful account creation
- ✅ Handles errors gracefully

### 4. **Frontend Utilities**
- ✅ Created `/lib/referral.ts`
- ✅ `getReferralCodeFromCookie()` - Read stored referrer
- ✅ `clearReferralCookie()` - Clear after signup
- ✅ `createUserWithReferral()` - Create user with referral tracking
- ✅ `getUserReferralStats()` - Fetch referral stats

### 5. **Database Schema**
- ✅ Updated `/scripts/setup-referral-tables.sql`
- ✅ Created function `increment_referrals()` for safe counting
- ✅ Proper indexes for performance
- ✅ RLS policies for security

### 6. **Documentation**
- ✅ Created `/REFERRAL_SYSTEM.md` - Complete guide
- ✅ Created `/REFERRAL_IMPLEMENTATION.md` - This file

---

## 🚀 Next Steps to Deploy

### Step 1: Run Database Migration
```sql
-- Execute in Supabase SQL Editor or your database tool
-- File: scripts/setup-referral-tables.sql

-- This will create:
-- - referral_users table
-- - referrals table
-- - referral_leaderboard view
-- - increment_referrals() function
-- - RLS policies
-- - Indexes
```

### Step 2: Verify Environment Variables
In your Supabase project, ensure these are set:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 3: Test the Flow

**Test 1: Referral Link Capture**
```javascript
// In browser console
document.cookie // Should show referrer_code=ABC123
```

**Test 2: Wallet Connection**
```javascript
// Connect wallet in UI
// Check console for: "User account created with referral"
// Check database for new record in referral_users
```

**Test 3: Points Award**
```sql
-- Check in Supabase
SELECT * FROM referral_users WHERE wallet_address = '0x...';
-- Should show total_points updated
```

---

## 📋 Referral Link Templates

### Basic Referral Links
```
https://yoursite.com/?ref=ABC123
https://yoursite.com/airdrop?ref=ABC123
https://yoursite.com/referral?ref=ABC123
```

### QR Code Referral Links
Generate QR codes pointing to:
```
https://yoursite.com/?ref=USER_REFERRAL_CODE
```

### Social Share Templates
```
Twitter: Check out this project! Join with my referral: https://yoursite.com/?ref=ABC123

Discord: Use my referral code ABC123 at https://yoursite.com to get bonus points!
```

---

## 🔧 Configuration Options

### Points Per Referral
File: `/app/api/referral/create-user/route.ts`
```typescript
const REFERRAL_BONUS = 100    // Change this value
const NEW_USER_BONUS = 25     // Change this value
```

### Cookie Expiration
File: `/components/referral-capture.tsx`
```typescript
setCookie('referrer_code', ref, 30) // Days until expiration
```

### API Response Format
All APIs in `/app/api/referral/` return standardized JSON with:
```json
{
  "success": boolean,
  "data": { ... },
  "error": string | undefined
}
```

---

## 🐛 Debugging Guide

### Check Referral Cookie
```javascript
document.cookie.split(';').find(c => c.includes('referrer_code'))
// Output: "referrer_code=ABC123"
```

### Check Browser Network
1. Open DevTools → Network tab
2. Filter: `referral`
3. Look for POST requests to `/api/referral/create-user`
4. Check response status (should be 201 for new user)

### Check Database
```sql
-- See all users
SELECT wallet_address, referral_code, total_points 
FROM referral_users 
ORDER BY total_points DESC;

-- See referral relationships
SELECT r.*, ru.wallet_address as referrer_wallet
FROM referrals r
LEFT JOIN referral_users ru ON r.referrer_id = ru.id
ORDER BY r.created_at DESC;
```

### Enable Debug Logs
The code includes console.log with `[v0]` prefix. Check console output:
```
[v0] Stored referrer code: ABC123
[v0] User account created with referral: {...}
[v0] Error in create-user referral: ...
```

---

## ⚠️ Important Considerations

### Security
- ✅ Cookies are HttpOnly-friendly (set properly)
- ✅ Server validates all referrals
- ✅ Database constraints prevent duplicates
- ✅ No localStorage (which is hackable)

### Performance
- ✅ Indexes on wallet_address, referral_code
- ✅ Referral processing async (non-blocking)
- ✅ View-based leaderboard (no recalculation)

### Data Integrity
- ✅ Transaction-safe operations
- ✅ RLS policies prevent unauthorized access
- ✅ Audit trail in referrals table

---

## 📊 Analytics & Monitoring

### Key Metrics to Track
```sql
-- Total referrals processed
SELECT COUNT(*) as total_referrals FROM referrals;

-- Top 10 referrers
SELECT * FROM referral_leaderboard LIMIT 10;

-- Referral success rate
SELECT 
  COUNT(*) as total_attempted,
  COUNT(referred_user_id) as successful,
  ROUND(COUNT(referred_user_id)::float / COUNT(*) * 100, 2) as success_rate
FROM referrals;
```

---

## 🎯 Common Use Cases

### 1. Display User's Referral Code
```typescript
const stats = await getUserReferralStats(walletAddress)
console.log('Your code:', stats.referral_code)
console.log('Your points:', stats.total_points)
```

### 2. Generate Referral Link
```typescript
const referralLink = `https://yoursite.com/?ref=${referralCode}`
```

### 3. Share Referral Link
```typescript
// Copy to clipboard
navigator.clipboard.writeText(referralLink)

// Open Twitter
window.open(`https://twitter.com/intent/tweet?text=Join%20with%20my%20referral!%20${referralLink}`)
```

### 4. Show Leaderboard
```sql
SELECT * FROM referral_leaderboard LIMIT 100;
```

---

## ✨ Features by Design

### Why Cookies Instead of localStorage?
- ✅ Sent to server automatically
- ✅ Persists across tabs/windows
- ✅ Survives page refresh
- ✅ More secure (HttpOnly flag possible)
- ✅ Standard web practice

### Why Points Only on Signup?
- ✅ Prevents bot abuse
- ✅ Real conversion tracking
- ✅ Reduces spam referrals
- ✅ Aligns incentives properly

### Why Database Validation?
- ✅ Can't be spoofed from frontend
- ✅ Audit trail for disputes
- ✅ Easy to enforce rules
- ✅ Scalable

---

## 🆘 Troubleshooting Common Issues

### Issue: Cookie not being set
**Solution:** Check browser privacy settings, use ?ref parameter correctly

### Issue: Referral not processing
**Solution:** Verify referrer_code exists in database, check API logs

### Issue: Points showing zero
**Solution:** Verify REFERRAL_BONUS constant, check database transaction logs

### Issue: Self-referral happening
**Solution:** Server-side validation should prevent this, check `.neq('wallet_address', walletAddress)`

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Error Logs**: Check Supabase → Edge Functions → Logs

---

**Last Updated**: January 2026
**Version**: 1.0 - Initial Implementation
