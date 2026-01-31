# Referral System Documentation

## Overview

The referral system awards points **only when a user creates an account or connects their wallet**. This prevents fraud and ensures that referral rewards are tied to real user acquisitions, not just page visits.

## System Flow

### 1. Initial Visit with Referral Link
```
User clicks: https://yoursite.com/?ref=ABC123
↓
ReferralCapture component reads URL parameter
↓
Stores referrer code in cookie (NOT localStorage)
↓
Cookie persists across browser sessions
```

### 2. Wallet Connection / Account Creation
```
User connects Phantom wallet
↓
WalletContext triggers "connect" event
↓
createUserWithReferral() API is called
↓
Backend validates referrer code
↓
User account is created in DB
↓
If valid referrer: Award points to referrer
↓
Clear referral cookie
```

### 3. Points Awarded
- **When**: Only when an account is created (wallet connected)
- **To Referrer**: 100 points (configurable in `/app/api/referral/create-user/route.ts`)
- **To New User**: 25 points bonus (optional, configurable)
- **Validation**: No self-referrals, prevents refresh abuse

## Database Schema

### referral_users Table
```sql
id              UUID PRIMARY KEY
wallet_address  TEXT UNIQUE      -- User's wallet address
referral_code   TEXT UNIQUE      -- Unique code for referrals (e.g., ABC123)
total_referrals INTEGER DEFAULT 0 -- Count of successful referrals
total_points    INTEGER DEFAULT 0 -- Total points earned
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### referrals Table
```sql
id              UUID PRIMARY KEY
referrer_id     UUID -- References referral_users(id)
referred_wallet TEXT -- New user's wallet address
referred_user_id UUID -- References referral_users(id) after account creation
points_earned   INTEGER DEFAULT 100 -- Points awarded to referrer
status          TEXT DEFAULT 'pending' -- pending, confirmed, completed
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## API Endpoints

### POST `/api/referral/create-user`
Called when user connects wallet. Creates user account and processes referral.

**Request:**
```json
{
  "walletAddress": "0xABC123...",
  "referrerCode": "ABC123" // null if no referral
}
```

**Response:**
```json
{
  "success": true,
  "isNewUser": true,
  "referral_code": "XYZ789",
  "total_points": 125, // 100 for referral + 25 bonus
  "message": "User created successfully"
}
```

### POST `/api/referral/get-or-create`
Gets or creates a referral user. Used to fetch user's referral code and stats.

**Request:**
```json
{
  "walletAddress": "0xABC123..."
}
```

**Response:**
```json
{
  "referral_code": "ABC123",
  "referral_url": "https://yoursite.com/?ref=ABC123",
  "points": 500
}
```

## Frontend Integration

### Using the Referral Utilities

```typescript
import { 
  getReferralCodeFromCookie,
  createUserWithReferral,
  getUserReferralStats
} from '@/lib/referral'

// Get stored referral code
const referrerCode = getReferralCodeFromCookie()

// Create user with referral tracking
const result = await createUserWithReferral('0xWalletAddress')
if (result.success) {
  console.log('Points earned:', result.total_points)
}

// Get user's referral stats
const stats = await getUserReferralStats('0xWalletAddress')
console.log('Your referral code:', stats.referral_code)
```

### Referral Link Format

Generate referral links like this:
```
https://yoursite.com/?ref=ABC123
https://yoursite.com/airdrop?ref=ABC123
```

The referral code is captured automatically on first visit and stored in a cookie.

## Security Features

✅ **Fraud Prevention**
- Cookies work better than localStorage for cross-page persistence
- Server-side validation prevents fake claims
- No self-referrals allowed
- One account per wallet address

✅ **Data Integrity**
- Points awarded only on account creation
- Database-backed tracking (not frontend-only)
- Transaction-safe operations

✅ **Privacy**
- Row Level Security (RLS) enabled
- Cookies have 30-day expiration
- Cleared automatically after signup

## Configuration

### Adjust Point Values

Edit `/app/api/referral/create-user/route.ts`:

```typescript
const REFERRAL_BONUS = 100     // Points for referrer
const NEW_USER_BONUS = 25      // Bonus for new user
```

### Adjust Cookie Expiration

Edit `/components/referral-capture.tsx`:

```typescript
setCookie('referrer_code', ref, 30) // 30 days
```

## Troubleshooting

### Points Not Awarded?
1. ✓ Verify cookie is being set: Check browser DevTools → Application → Cookies
2. ✓ Verify wallet is connecting: Check console logs
3. ✓ Verify database is set up: Run `setup-referral-tables.sql`
4. ✓ Check Supabase environment variables are set

### Referral Code Not Generated?
1. Wallet must be connected first
2. Check network request to `/api/referral/create-user`
3. Verify response status is 201

### Self-Referrals Not Blocked?
Check the backend validation in `/app/api/referral/create-user/route.ts` - it includes:
```typescript
.neq('wallet_address', walletAddress) // Prevent self-referral
```

## Testing the System

1. **Test Referral Capture:**
   ```
   Visit: https://yoursite.com/?ref=TEST123
   Check cookie: document.cookie
   ```

2. **Test Account Creation:**
   ```
   Connect wallet
   Check API call to /api/referral/create-user
   Verify points in database
   ```

3. **Test Leaderboard:**
   ```
   Query referral_leaderboard view
   Verify rankings by total_points
   ```

## Next Steps

- Integrate with airdrop/rewards distribution system
- Add UI to display user's referral code and stats
- Create leaderboard page showing top referrers
- Add referral invite email/share functionality
