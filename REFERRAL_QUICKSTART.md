# Referral System - Quick Start Guide

## TL;DR

The referral system now **awards points ONLY when users create accounts**, not on page visits. This is fraud-proof and actually works.

---

## ⚡ 5-Minute Setup

### Step 1: Run Database Migration
Copy and paste into your Supabase SQL Editor:

```sql
-- From: scripts/setup-referral-tables.sql
-- Paste entire file contents into Supabase SQL Editor
-- Click "Run"
```

**What this does:**
- Creates `referral_users` table (stores user + points)
- Creates `referrals` table (tracks who referred whom)
- Creates leaderboard view
- Sets up security policies
- Creates helper function

### Step 2: Verify Environment Variables
In your Vercel/Supabase project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 3: Test It
1. Visit: `https://yoursite.com/?ref=TEST123`
2. Open DevTools → Console → Type: `document.cookie`
3. Should see: `referrer_code=TEST123`
4. Connect wallet
5. Check database for points

**Done!** ✅

---

## 🔗 Generate Referral Links

### For Users
```typescript
// Get user's unique code
const code = userData.referral_code; // e.g., "ABC123"

// Create link
const link = `https://yoursite.com/?ref=${code}`;
```

### Share Anywhere
```
https://yoursite.com/?ref=ABC123
https://yoursite.com/airdrop?ref=ABC123
https://yoursite.com/referral?ref=ABC123
```

---

## 📊 Check Points in Database

### See All Users
```sql
SELECT wallet_address, referral_code, total_points, total_referrals
FROM referral_users
ORDER BY total_points DESC;
```

### See Referral Relationships
```sql
SELECT 
  r.id,
  ru.wallet_address as referrer,
  r.referred_wallet as new_user,
  r.points_earned,
  r.status,
  r.created_at
FROM referrals r
LEFT JOIN referral_users ru ON r.referrer_id = ru.id
ORDER BY r.created_at DESC;
```

### See Leaderboard
```sql
SELECT * FROM referral_leaderboard LIMIT 10;
```

---

## 🎯 How It Works

### The Simple Flow
```
Referral Link → Stored in Cookie → Wallet Connect → Account Created → Points Awarded
```

### Why This Way?
- ✅ Can't cheat (server validates everything)
- ✅ Points awarded at the right time (signup)
- ✅ Works across page refreshes
- ✅ Prevents self-referrals and bot abuse

---

## 🔧 Customize Rewards

### Change Points Per Referral
File: `/app/api/referral/create-user/route.ts`

```typescript
const REFERRAL_BONUS = 100    // ← Change this number
const NEW_USER_BONUS = 25     // ← Or this one
```

### Change Cookie Duration
File: `/components/referral-capture.tsx`

```typescript
setCookie('referrer_code', ref, 30)  // ← Change 30 to 60, 90, etc.
```

---

## 🐛 Debug Issues

### Check If Cookie Is Set
```javascript
// In browser console
document.cookie
// Should show: referrer_code=ABC123
```

### Check If Account Created
```javascript
// In browser console
// Open Network tab
// Look for POST to /api/referral/create-user
// Response should show: "success": true
```

### Check Database Directly
```sql
-- In Supabase SQL Editor
SELECT * FROM referral_users 
WHERE wallet_address = '0x...YOUR_WALLET...';

-- Should show your record with updated total_points
```

---

## 📱 Frontend Usage

### Example: Display Referral Code

```typescript
import { getUserReferralStats } from '@/lib/referral'

export function ReferralCard() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    const fetchStats = async () => {
      const result = await getUserReferralStats(walletAddress)
      setStats(result)
    }
    fetchStats()
  }, [walletAddress])
  
  return (
    <div>
      <p>Your Referral Code: <strong>{stats?.referral_code}</strong></p>
      <p>Points Earned: <strong>{stats?.total_points}</strong></p>
      <p>Share: {stats?.referral_url}</p>
    </div>
  )
}
```

### Example: Share Button

```typescript
function ShareReferralButton({ referralCode, walletAddress }) {
  const link = `https://yoursite.com/?ref=${referralCode}`
  
  const openTwitter = () => {
    const text = `Join with my referral link! ${link}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
    alert('Referral link copied!')
  }
  
  return (
    <div>
      <button onClick={copyToClipboard}>Copy Link</button>
      <button onClick={openTwitter}>Share on Twitter</button>
    </div>
  )
}
```

---

## 🚨 Important Notes

### Cookies vs LocalStorage
- ✅ **Cookies**: Sent to server, persist across tabs, more secure
- ❌ **localStorage**: Frontend only, can be hacked, doesn't work across tabs

### Why This System Works
```
OLD SYSTEM (Broken):
  Visit → localStorage → (nothing happens) → ❌

NEW SYSTEM (Works):
  Visit → Cookie → Wallet Connect → Account Created → Points ✅
```

### Fraud Prevention
```
✓ Self-referral prevention: Server checks wallet address
✓ One account per wallet: Unique constraint in database
✓ Server validation: Can't fake points from frontend
✓ Audit trail: All referrals recorded in database
```

---

## 📈 Real-World Example

### User A (Referrer)
```
1. User A connects wallet: 0xAAAA
2. Gets referral code: "ABC123"
3. Shares link: https://yoursite.com/?ref=ABC123
```

### User B (Referred)
```
1. Clicks link: https://yoursite.com/?ref=ABC123
2. Cookie stores: referrer_code=ABC123
3. Connects wallet: 0xBBBB
4. Account created
5. Referral recorded: ABC123 referred 0xBBBB
```

### Database Result
```sql
-- referral_users table
User A: wallet=0xAAAA, total_points=100 (earned), total_referrals=1
User B: wallet=0xBBBB, total_points=25 (new user bonus), total_referrals=0

-- referrals table
referrer_id=<A>, referred_wallet=0xBBBB, referred_user_id=<B>, 
points_earned=100, status=confirmed
```

---

## ✅ Verification Checklist

Run through these to verify everything works:

- [ ] Can see `referrer_code` cookie in DevTools
- [ ] Can see POST request to `/api/referral/create-user` in Network tab
- [ ] Response shows `"success": true` and correct points
- [ ] Database shows new record in `referral_users`
- [ ] `total_points` is updated correctly
- [ ] Leaderboard view shows the user
- [ ] Can't self-refer (tested with same wallet)
- [ ] Can see referral relationship in `referrals` table

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cookie not set | Check ?ref parameter in URL |
| Account not created | Check console errors, verify wallet connection |
| Points not awarded | Verify database migration ran, check API response |
| Self-referral allowed | Update create-user route, check `.neq()` clause |
| Leaderboard empty | Run `SELECT * FROM referral_leaderboard;` |

---

## 📚 More Info

See these files for detailed documentation:

- **`REFERRAL_SYSTEM.md`** - Complete system documentation
- **`REFERRAL_IMPLEMENTATION.md`** - Deployment & debugging guide
- **`CHANGES_SUMMARY.md`** - What changed and why

---

## 🎉 You're Done!

Your referral system now:
- ✅ Actually records referrals
- ✅ Awards points at the right time
- ✅ Prevents fraud
- ✅ Scales well
- ✅ Is secure

**Next steps:**
1. Create a referral dashboard UI
2. Add leaderboard page
3. Build sharing/invite features
4. Connect to airdrop distribution

---

**Questions?** Check the debug guide in `REFERRAL_IMPLEMENTATION.md`
