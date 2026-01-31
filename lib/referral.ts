/**
 * Referral System Utilities
 * 
 * This module handles all referral-related operations:
 * - Reading stored referral codes from cookies
 * - Creating new user accounts with referral tracking
 * - Retrieving user referral stats
 */

// Get stored referral code from cookie
export function getReferralCodeFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const nameEQ = 'referrer_code='
  const cookies = document.cookie.split(';')
  
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length)
    }
  }
  
  return null
}

// Clear referral cookie after signup (optional)
export function clearReferralCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = 'referrer_code=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
}

// Create a new user account with referral tracking
export async function createUserWithReferral(
  walletAddress: string
): Promise<{
  success: boolean
  isNewUser: boolean
  referral_code: string
  total_points: number
  message?: string
  error?: string
}> {
  try {
    const referrerCode = getReferralCodeFromCookie()
    
    const response = await fetch('/api/referral/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        referrerCode: referrerCode || null,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        isNewUser: false,
        referral_code: '',
        total_points: 0,
        error: data.error || 'Failed to create user account',
      }
    }

    // Clear the referral cookie after successful signup
    if (data.isNewUser) {
      clearReferralCookie()
    }

    return {
      success: true,
      isNewUser: data.isNewUser,
      referral_code: data.referral_code,
      total_points: data.total_points,
      message: data.message,
    }
  } catch (error) {
    console.error('[v0] Error in createUserWithReferral:', error)
    return {
      success: false,
      isNewUser: false,
      referral_code: '',
      total_points: 0,
      error: 'Network error - please try again',
    }
  }
}

// Get user's referral statistics
export async function getUserReferralStats(
  walletAddress: string
): Promise<{
  success: boolean
  referral_code?: string
  total_referrals?: number
  total_points?: number
  referral_url?: string
  error?: string
}> {
  try {
    const response = await fetch('/api/referral/get-or-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to retrieve referral stats',
      }
    }

    return {
      success: true,
      referral_code: data.referral_code,
      total_points: data.points || 0,
      referral_url: data.referral_url,
    }
  } catch (error) {
    console.error('[v0] Error in getUserReferralStats:', error)
    return {
      success: false,
      error: 'Network error - please try again',
    }
  }
}
