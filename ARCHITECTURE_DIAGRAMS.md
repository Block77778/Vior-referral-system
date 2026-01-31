# Referral System - Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REFERRAL SYSTEM                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐    ┌────────────────────┐   ┌──────────────┐ │
│  │   FRONTEND       │    │   BACKEND          │   │  DATABASE    │ │
│  ├──────────────────┤    ├────────────────────┤   ├──────────────┤ │
│  │ ReferralCapture  │───→│ create-user        │──→│ referral_    │ │
│  │ (captures link)  │    │ (process referral) │   │ users        │ │
│  │                  │    │                    │   │              │ │
│  │ WalletContext    │    │ get-or-create      │   │ referrals    │ │
│  │ (triggers API)   │───→│ (fetch stats)      │──→│              │ │
│  │                  │    │                    │   │ referral_    │ │
│  │ referral utils   │    │ leaderboard        │   │ leaderboard  │ │
│  │ (helpers)        │───→│ (get rankings)     │──→│ (view)       │ │
│  └──────────────────┘    └────────────────────┘   └──────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ COOKIES                                                           ││
│  │ referrer_code = ABC123 (persists 30 days)                       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Journey (Timeline)

```
TIME    USER                    FRONTEND                BACKEND          DATABASE
───────────────────────────────────────────────────────────────────────────────

T+0     User clicks
        referral link
        ?ref=ABC123
                                │
                                ├─ ReferralCapture runs
                                ├─ Read ref param
                                └─ Store in cookie

T+30s   User navigates
        around site
                                │
                                └─ Cookie persists
                                   (sent with requests)

T+5m    User connects
        Phantom wallet
                                │
                                ├─ WalletContext event fires
                                ├─ Read cookie
                                ├─ Get referrer code
                                └─ Call POST /api/referral/create-user
                                                        │
                                                        ├─ Validate wallet
                                                        ├─ Check if exists
                                                        ├─ Create user
                                                        ├─ Find referrer
                                                        ├─ Validate (not self)
                                                        └─ Award points ──→ INSERT user
                                                                          INSERT referral
                                                                          UPDATE referrer
                                                        
                                ├─ Receive response
                                ├─ Show success
                                └─ Clear cookie

T+5:30m User sees
        referral code
        in dashboard
                                │
                                ├─ GET /api/referral/stats
                                                        │
                                                        └─ Return user stats ──→ SELECT user
                                                                                SELECT stats

```

---

## Data Flow (Detailed)

```
FRONTEND                                BACKEND                         DATABASE
────────────────────────────────────────────────────────────────────────────────

Step 1: CAPTURE
┌──────────────┐
│ User visits  │
│ ?ref=ABC123  │
└──────────────┘
       │
       ├─ ReferralCapture.tsx
       │  ├─ Read URL params
       │  ├─ Check for existing cookie
       │  ├─ Create cookie
       │  └─ setCookie('referrer_code', 'ABC123', 30)
       │
       └─ BROWSER
          localStorage × (NOT USED)
          sessionStorage × (NOT USED)
          cookies ✓ (referrer_code=ABC123)

Step 2: PERSIST
           User refreshes page
                │
           Cookie still there
           (sent to backend with requests)

Step 3: TRIGGER
┌──────────────┐
│ Connect      │
│ Phantom      │
└──────────────┘
       │
       └─ WalletContext.tsx
          ├─ Detect "connect" event
          ├─ Get wallet address
          ├─ Call createUser()
          │
          └─ fetch('/api/referral/create-user', {
               walletAddress: '0xABC...',
               referrerCode: getReferralCodeFromCookie()
             })
                    │
                    │ POST request
                    ├──────────────────────→ Backend
                                            │
                                            ├─ app/api/referral/create-user/route.ts
                                            │
                                            ├─ Validate inputs
                                            │  ├─ Check wallet format
                                            │  ├─ Check referrer format
                                            │  └─ Sanitize inputs
                                            │
                                            ├─ Query database
                                            │  │
                                            │  └─ SELECT * FROM referral_users
                                            │     WHERE wallet_address = '0xABC...'
                                            │                              │
                                            │     Returns: null (new user) │
                                            │                              │
                                            │     SUPABASE ←──────────────┘
                                            │
                                            ├─ Create new user
                                            │  │
                                            │  └─ INSERT INTO referral_users
                                            │     (wallet_address, referral_code, ...)
                                            │     VALUES ('0xABC...', 'NEWCODE', ...)
                                            │     RETURNING *
                                            │                              │
                                            │     User created ←──────────┤
                                            │     id: <uuid>              │
                                            │     referral_code: NEWCODE  │
                                            │     total_points: 25        │
                                            │                              │
                                            │     SUPABASE ←──────────────┘
                                            │
                                            ├─ Process referral
                                            │  │
                                            │  ├─ SELECT * FROM referral_users
                                            │  │  WHERE referral_code = 'ABC123'
                                            │  │                          │
                                            │  │  Returns: referrer      │
                                            │  │  id: <uuid>             │
                                            │  │  total_points: 500      │
                                            │  │                         │
                                            │  │  SUPABASE ←─────────────┘
                                            │  │
                                            │  ├─ Check not self-referral
                                            │  │  ('0xABC...' != '0xNEW...')
                                            │  │  ✓ OK
                                            │  │
                                            │  ├─ INSERT INTO referrals
                                            │  │  (referrer_id, referred_wallet, ...)
                                            │  │  VALUES (<ref-id>, '0xNEW...', ...)
                                            │  │                          │
                                            │  │  SUPABASE ←─────────────┘
                                            │  │
                                            │  └─ UPDATE referral_users
                                            │     SET total_points = 600,
                                            │         total_referrals = 51
                                            │     WHERE id = <ref-id>
                                            │                          │
                                            │     SUPABASE ←──────────┘
                                            │
                                            └─ Return response
                                               {
                                                 success: true,
                                                 isNewUser: true,
                                                 referral_code: 'NEWCODE',
                                                 total_points: 25
                                               }
                    ↓
                    │ Response
       │────────────┘
       │
       ├─ Show success message
       ├─ Display referral code
       ├─ Clear referral cookie
       └─ Update UI
```

---

## Database Schema Relationships

```
referral_users (Main users table)
┌────────────────────────────────────┐
│ id (PK)              [UUID]         │
│ wallet_address       [TEXT UNIQUE]  │──┐
│ referral_code        [TEXT UNIQUE]  │  │
│ total_points         [INT]          │  │
│ total_referrals      [INT]          │  │
│ created_at           [TIMESTAMP]    │  │
│ updated_at           [TIMESTAMP]    │  │
└────────────────────────────────────┘  │
         ↑                               │
         │ (referrer_id FK)             │
         │                              │
referrals (Tracks referral relationships)
┌────────────────────────────────────┐  │
│ id (PK)              [UUID]         │  │
│ referrer_id (FK) ────────────────────┤
│ referred_wallet      [TEXT]          │
│ referred_user_id (FK)                │
│ points_earned        [INT = 100]     │
│ status               [TEXT]          │
│ created_at           [TIMESTAMP]     │
│ updated_at           [TIMESTAMP]     │
└────────────────────────────────────┘
         ↑
         │
         └─→ referral_leaderboard (VIEW)
             ┌────────────────────────────────────┐
             │ id                                  │
             │ wallet_address                      │
             │ referral_code                       │
             │ total_referrals                     │
             │ total_points                        │
             │ created_at                          │
             │ rank (calculated)                   │
             └────────────────────────────────────┘
```

---

## API Call Flow

```
BROWSER
  │
  └─ POST /api/referral/create-user
     │
     ├─ Headers: Content-Type: application/json
     │
     └─ Body:
        {
          walletAddress: "0xABC123...",
          referrerCode: "ABC123" || null
        }
                    │
                    ↓
        Next.js API Route Handler
        ├─ Parse request body
        ├─ Validate parameters
        ├─ Create Supabase client
        ├─ Execute queries
        ├─ Handle errors
        │
        └─ Return Response
           {
             success: true,
             isNewUser: true,
             referral_code: "NEWCODE",
             total_points: 125
           }
                    │
                    ↓
        Browser receives response
        ├─ Parse JSON
        ├─ Check status
        ├─ Update UI
        └─ Clear cookie

                ↓
        User sees success message ✓
```

---

## State Machine

```
User States During Referral Process:

┌─────────────┐
│   INITIAL   │  User lands on site with ?ref=ABC123
└──────┬──────┘
       │
       ├─ ReferralCapture runs
       └─ Cookie set ↓

┌─────────────────────────────┐
│  REFERRAL CAPTURED          │  
│  referrer_code=ABC123       │  (30 day duration)
└──────┬──────────────────────┘
       │
       │ (User navigates, cookie persists)
       │
       ├─ User clicks "Connect Wallet" ↓

┌──────────────────────────┐
│  WALLET CONNECTING       │
│  (Phantom popup open)    │
└──────┬───────────────────┘
       │
       ├─ User approves → wallet connects ↓
       │
       └─ User rejects → stays on site ↓

┌──────────────────────────┐
│  WALLET CONNECTED        │
│  (Processing referral)   │
└──────┬───────────────────┘
       │
       ├─ create-user API called
       ├─ Account created
       ├─ Referral processed
       ├─ Points awarded
       └─ Cookie cleared ↓

┌──────────────────────────┐
│  SUCCESS                 │
│  Points in database ✓    │
│  Cookie cleared ✓        │
└──────────────────────────┘
```

---

## Points Flow

```
NEW USER (Bonus)
│
└─ Receives 25 points
   ├─ INSERT INTO referral_users (total_points = 25)
   └─ User balance: 25 points


REFERRER (Reward)
│
├─ Finds referrer via referral_code
├─ Awards 100 points
│  ├─ INSERT INTO referrals (points_earned = 100)
│  └─ UPDATE referral_users (total_points += 100)
│
└─ Referrer balance: +100 points


Database Transactions:
├─ BEGIN TRANSACTION
├─ INSERT user
├─ INSERT referral
├─ UPDATE referrer
└─ COMMIT
   (All succeed or all fail - no partial updates)
```

---

## Error Handling Flow

```
create-user Request
│
├─ Invalid wallet format?
│  └─ RETURN 400 { error: "Invalid wallet address format" }
│
├─ Request missing walletAddress?
│  └─ RETURN 400 { error: "Wallet address is required" }
│
├─ Database error during user creation?
│  └─ RETURN 500 { error: "Failed to create user account" }
│
├─ Referrer code doesn't exist?
│  └─ LOG warning, continue without referral
│
├─ Self-referral detected?
│  └─ LOG warning, don't award points, continue
│
└─ SUCCESS
   └─ RETURN 201/200 { success: true, ... }
```

---

## Cookie Lifecycle

```
TIME        EVENT                          COOKIE STATE
────────────────────────────────────────────────────────────

T+0         User visits ?ref=ABC123        
            ReferralCapture runs           
            setCookie() called             
                                          ✓ referrer_code=ABC123
                                            (expires: T+30d)

T+0:10s     User navigates around          ✓ referrer_code=ABC123
            Cookie sent with each request  

T+5m        User connects wallet
            API returns success            
            clearReferralCookie() called   
                                          ✗ referrer_code=ABC123
                                            (deleted)

T+5:01m     User checks cookies            
                                          ✗ Empty
                                            (or only other cookies)

T+30d       If never cleared
            Cookie expires naturally       ✗ Auto-deleted by browser
```

---

## Performance Metrics

```
Operation                    Time        Optimization
─────────────────────────────────────────────────────────

Read URL param               <1ms        Synchronous
Parse ref parameter          <1ms        Synchronous
Set cookie                   <1ms        Synchronous
Detect wallet connect        <1ms        Event listener

Query user by wallet         ~10ms       ✓ Indexed
Find referrer by code        ~10ms       ✓ Indexed
Create user record           ~20ms       Normal INSERT
Create referral record       ~10ms       Normal INSERT
Update referrer points       ~15ms       Normal UPDATE

Total API request time       ~100ms      ✓ Good
Total user journey           ~5min       User controls

Database queries             ~50ms       All indexed
Network overhead             ~50ms       Typical latency
```

---

## Security Layers

```
LAYER 1: Frontend Validation
├─ Check ref parameter format
├─ Check wallet format
└─ Warn on errors

LAYER 2: Cookie Storage
├─ SameSite=Lax
├─ 30-day expiration
└─ Auto-cleared after use

LAYER 3: Backend Validation
├─ Validate wallet format (regex)
├─ Validate referrer code format
├─ Check wallet is not empty string
└─ Sanitize all inputs

LAYER 4: Business Logic
├─ Prevent self-referral (.neq wallet_address)
├─ Check referrer exists
├─ Atomic transactions (all or nothing)
└─ Proper error handling

LAYER 5: Database
├─ UNIQUE constraints (wallet, code)
├─ NOT NULL constraints
├─ Foreign key constraints
├─ RLS policies (public read)
└─ Indexes for query safety
```

---

## Scaling Considerations

```
Current State:          Scaling Path:
────────────────────────────────────────

100 users          →   1,000 users         (OK)
│                      │
├─ Simple queries  ├─ Add caching (SWR)
├─ Direct DB       ├─ Add Redis cache
└─ No rate limit   └─ Add rate limiting

                        
10,000 users       →   100,000 users      (Optimize)
│                      │
├─ Indexed queries ├─ Batch operations
├─ View-based      ├─ Webhook system
└─ RLS policies    └─ CDN for leaderboard
```

---

This architecture is designed to be:

✨ **Simple**: Clear, understandable flow
🔒 **Secure**: Multiple validation layers  
📈 **Scalable**: Indexed queries, proper constraints
⚡ **Fast**: ~100ms response time
🛡️ **Reliable**: Atomic transactions, error handling
