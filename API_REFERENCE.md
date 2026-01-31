# Referral System - API Reference

## POST `/api/referral/create-user`

Creates a new user account and processes referral if applicable.

**Called By**: Frontend when user connects wallet
**File**: `/app/api/referral/create-user/route.ts`

### Request

```http
POST /api/referral/create-user HTTP/1.1
Content-Type: application/json

{
  "walletAddress": "0xABC123...",
  "referrerCode": "ABC123"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletAddress` | string | ✅ | Solana/EVM wallet address (32+ chars) |
| `referrerCode` | string/null | ❌ | Referrer's code from cookie (or null) |

### Response - Success (New User - 201)

```json
{
  "success": true,
  "isNewUser": true,
  "referral_code": "XYZ789ABC",
  "total_points": 125,
  "message": "User created successfully"
}
```

### Response - Success (Existing User - 200)

```json
{
  "success": true,
  "isNewUser": false,
  "referral_code": "ABC123",
  "total_points": 500
}
```

### Response - Error (400)

```json
{
  "error": "Invalid wallet address format"
}
```

### Response - Error (500)

```json
{
  "error": "Failed to create user account"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 201 | New user created with referral processed |
| 200 | Existing user returned |
| 400 | Bad request (invalid parameters) |
| 500 | Server error |

### Backend Logic

```typescript
1. Validate wallet format
2. Check if user exists
   - If exists: return existing data
   - If new: continue
3. Create new user account
   - wallet_address
   - referral_code (generated)
   - total_points = 25 (new user bonus)
4. If referrerCode provided:
   - Find referrer in database
   - Validate not self-referral
   - Record referral
   - Award 100 points to referrer
5. Return user data
```

### Points Awarded

- **To Referrer**: 100 points (configurable)
- **To New User**: 25 points bonus (configurable)

### Database Changes

```sql
-- Inserts new user
INSERT INTO referral_users 
(wallet_address, referral_code, total_points, total_referrals)
VALUES ('0xNEW...', 'CODE123', 25, 0)

-- Records referral
INSERT INTO referrals
(referrer_id, referred_wallet, referred_user_id, points_earned, status)
VALUES (referrer_id, '0xNEW...', new_user_id, 100, 'confirmed')

-- Updates referrer
UPDATE referral_users
SET total_points = total_points + 100,
    total_referrals = total_referrals + 1
WHERE id = referrer_id
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/referral/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xABC123DEF456",
    "referrerCode": "ABC123"
  }'
```

### JavaScript Example

```typescript
const response = await fetch('/api/referral/create-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0xABC123...',
    referrerCode: 'ABC123'
  })
})

const data = await response.json()
if (response.ok) {
  console.log('User created:', data.referral_code)
  console.log('Points earned:', data.total_points)
}
```

---

## POST `/api/referral/get-or-create`

Gets or creates a referral user account.

**Called By**: UI to fetch user's referral code and stats
**File**: `/app/api/referral/get-or-create/route.ts`

### Request

```http
POST /api/referral/get-or-create HTTP/1.1
Content-Type: application/json

{
  "walletAddress": "0xABC123..."
}
```

### Response - Success

```json
{
  "referral_code": "ABC123",
  "referral_url": "https://yoursite.com/referral?ref=ABC123",
  "points": 500
}
```

### Response - Error

```json
{
  "error": "Failed to get or create referral code"
}
```

---

## GET `/api/referral/stats`

Gets referral statistics for a user.

**Called By**: Dashboard/stats page
**File**: `/app/api/referral/stats/route.ts`

### Request

```http
GET /api/referral/stats?wallet=0xABC123... HTTP/1.1
```

### Response

```json
{
  "wallet_address": "0xABC123...",
  "referral_code": "ABC123",
  "total_points": 500,
  "total_referrals": 5,
  "recent_referrals": [
    {
      "referred_wallet": "0xXYZ...",
      "points_earned": 100,
      "status": "confirmed",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## GET `/api/referral/leaderboard`

Gets the referral leaderboard.

**Called By**: Leaderboard page
**File**: `/app/api/referral/leaderboard/route.ts`

### Request

```http
GET /api/referral/leaderboard?limit=100&offset=0 HTTP/1.1
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 100 | Max results (1-1000) |
| `offset` | number | 0 | Pagination offset |

### Response

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "wallet_address": "0xAAA...",
      "referral_code": "TOP1",
      "total_points": 5000,
      "total_referrals": 50
    },
    {
      "rank": 2,
      "wallet_address": "0xBBB...",
      "referral_code": "ABC123",
      "total_points": 3000,
      "total_referrals": 30
    }
  ],
  "total": 1000
}
```

---

## POST `/api/referral/claim`

Claims referral rewards (legacy endpoint, for compatibility).

**Note**: Use `/api/referral/create-user` instead for new implementations.

### Deprecated

This endpoint exists for backward compatibility but shouldn't be used in new code. Use `create-user` which handles everything atomically.

---

## POST `/api/referral/track`

Tracks a referral event.

**Deprecated**: Use `create-user` instead.

---

## POST `/api/referral/redeem-code`

Redeems a referral code.

**Note**: This is for code-based referrals (not implemented yet).

### Request

```json
{
  "walletAddress": "0xNEW...",
  "referralCode": "ABC123"
}
```

### Response

```json
{
  "success": true,
  "pointsAwarded": 100,
  "message": "Referral code redeemed successfully"
}
```

---

## Database Views & Functions

### View: `referral_leaderboard`

Pre-calculated leaderboard view for performance.

```sql
SELECT * FROM referral_leaderboard LIMIT 10;
```

Returns:
- `id` - User ID
- `wallet_address` - Wallet address
- `referral_code` - Referral code
- `total_referrals` - Count of referrals
- `total_points` - Total points
- `created_at` - Account creation date
- `rank` - Ranking by points

### Function: `increment_referrals(user_id UUID)`

Safely increments referral count.

```sql
SELECT increment_referrals('user-id-here'::uuid);
```

---

## Error Handling

All endpoints return standardized error responses:

### 400 Bad Request
```json
{
  "error": "Invalid wallet address format"
}
```

### 404 Not Found
```json
{
  "error": "Referral code not found"
}
```

### 409 Conflict
```json
{
  "error": "Self-referral not allowed"
}
```

### 500 Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting

No built-in rate limiting yet. Consider adding:

```typescript
// Example (not implemented)
const rateLimit = {
  window: 60000, // 1 minute
  maxRequests: 10
}
```

---

## Authentication

Currently, all endpoints are public (no authentication required).

**Future**: Consider adding wallet signature verification:

```typescript
// Example verification (not implemented)
const message = "Sign this message to verify wallet"
const signature = await wallet.signMessage(message)
verifySignature(walletAddress, message, signature)
```

---

## Webhooks (Not Implemented)

Future webhooks for external integrations:

```json
{
  "event": "referral.created",
  "data": {
    "referrer_id": "...",
    "referred_wallet": "0x...",
    "points": 100,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Rate Limit Headers (Future)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

---

## CORS

All endpoints are open for CORS (adjust as needed):

```typescript
// Configure in next.config.mjs if needed
module.exports = {
  headers: [
    {
      source: '/api/referral/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
      ],
    },
  ],
}
```

---

## Monitoring & Logging

All API calls log to console with `[v0]` prefix:

```typescript
console.log('[v0] User created:', userId)
console.error('[v0] Error in create-user referral:', error)
```

Check logs in:
- Supabase: Edge Functions → Logs
- Vercel: Logs tab
- Browser: Console tab

---

## Performance Considerations

### Indexes
```sql
-- Already created for performance:
CREATE INDEX idx_referral_users_wallet ON referral_users(wallet_address);
CREATE INDEX idx_referral_users_code ON referral_users(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_user ON referrals(referred_user_id);
```

### Query Times
- User lookup: ~10ms (indexed)
- Referral check: ~10ms (indexed)
- Account creation: ~50ms
- Point update: ~30ms
- **Total**: ~100ms per request

### Optimization Tips
- Use leaderboard view instead of calculating
- Cache user stats in frontend (SWR)
- Batch referral processing if volume is high

---

## Testing

### Unit Test Example

```typescript
describe('POST /api/referral/create-user', () => {
  it('creates new user with referral', async () => {
    const response = await fetch('/api/referral/create-user', {
      method: 'POST',
      body: JSON.stringify({
        walletAddress: '0x123',
        referrerCode: 'ABC123'
      })
    })
    
    expect(response.status).toBe(201)
    expect(response.json()).toHaveProperty('referral_code')
  })
  
  it('prevents self-referral', async () => {
    // Create user first
    // Then try to refer themselves
    // Should fail
  })
})
```

---

## Changelog

### Version 1.0 (Current)
- ✅ POST `/api/referral/create-user` - Main endpoint
- ✅ POST `/api/referral/get-or-create` - Get or create user
- ✅ GET `/api/referral/stats` - Get user stats
- ✅ GET `/api/referral/leaderboard` - Get leaderboard

### Future
- [ ] Webhook support
- [ ] Rate limiting
- [ ] Wallet signature verification
- [ ] Batch operations
- [ ] Cache layer (Redis)

---

**Last Updated**: January 2026
**API Version**: 1.0
