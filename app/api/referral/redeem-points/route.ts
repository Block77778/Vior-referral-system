import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { walletAddress, referralCode, redemptionType, pointsAmount } = body

    if (!walletAddress || !referralCode || !redemptionType || !pointsAmount) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (pointsAmount < 50) {
      return Response.json(
        { error: 'Minimum redemption is 50 points' },
        { status: 400 }
      )
    }

    // Get user from referral_users table
    const { data: user, error: userError } = await supabase
      .from('referral_users')
      .select('id, total_points, wallet_address')
      .eq('referral_code', referralCode)
      .single()

    if (userError || !user) {
      console.error('[v0] User lookup error:', userError)
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify wallet address matches
    if (user.wallet_address !== walletAddress) {
      return Response.json(
        { error: 'Wallet address mismatch' },
        { status: 403 }
      )
    }

    // Check if user has enough points
    if ((user.total_points || 0) < pointsAmount) {
      return Response.json(
        { error: `Insufficient points. You have ${user.total_points} points but need ${pointsAmount}` },
        { status: 400 }
      )
    }

    // Deduct points from user
    const newPoints = (user.total_points || 0) - pointsAmount
    const { error: updateError } = await supabase
      .from('referral_users')
      .update({
        total_points: newPoints,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('[v0] Update error:', updateError)
      return Response.json(
        { error: 'Failed to update points' },
        { status: 500 }
      )
    }

    // Log the redemption
    const { error: logError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: user.id,
        referred_wallet: walletAddress,
        referred_user_id: user.id,
        points_earned: -pointsAmount,
        status: 'redeemed',
        metadata: {
          redemption_type: redemptionType,
          redeemed_at: new Date().toISOString(),
        }
      })

    if (logError) {
      console.warn('[v0] Log redemption warning:', logError)
      // Don't fail if logging fails, the points were already deducted
    }

    console.log('[v0] Points redeemed successfully:', {
      user: user.id,
      code: referralCode,
      type: redemptionType,
      amount: pointsAmount,
      remainingPoints: newPoints,
    })

    return Response.json(
      {
        success: true,
        message: 'Points redeemed successfully',
        remainingPoints: newPoints,
        redemptionType,
        pointsRedeemed: pointsAmount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Redemption error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
