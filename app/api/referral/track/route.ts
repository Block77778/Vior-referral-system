import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { referralCode, newUserWallet } = await req.json()

    if (!referralCode || !newUserWallet) {
      return Response.json(
        { error: 'Missing referral code or wallet address' },
        { status: 400 }
      )
    }

    console.log('[v0] Tracking referral - Code:', referralCode, 'Wallet:', newUserWallet)

    // Get the referrer
    const { data: referrers } = await supabase
      .from('referral_users')
      .select('*')
      .eq('referral_code', referralCode)

    if (!referrers || referrers.length === 0) {
      console.log('[v0] Referral code not found:', referralCode)
      return Response.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    const referrer = referrers[0]
    console.log('[v0] Found referrer:', referrer.id)

    // Check if referred user already exists
    const { data: existingUsers } = await supabase
      .from('referral_users')
      .select('*')
      .eq('wallet_address', newUserWallet)

    if (existingUsers && existingUsers.length > 0) {
      console.log('[v0] User already has referral account')
      // User exists but record the referral if not already recorded
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('*')
        .eq('referred_wallet', newUserWallet)
        .eq('referrer_id', referrer.id)
        .single()

      if (!existingReferral) {
        // Add the referral record
        await supabase.from('referrals').insert({
          referrer_id: referrer.id,
          referred_wallet: newUserWallet,
        })

        // Give referrer 100 points
        const newPoints = (referrer.total_points || 0) + 100
        const newReferralCount = (referrer.total_referrals || 0) + 1

        await supabase
          .from('referral_users')
          .update({
            total_points: newPoints,
            total_referrals: newReferralCount,
          })
          .eq('id', referrer.id)

        console.log('[v0] Referral tracked, gave 100 points to referrer')
      }

      return Response.json({
        success: true,
        message: 'Referral already tracked for this user',
      })
    }

    // Create new referred user with their own referral code
    const { nanoid } = await import('nanoid')
    const newReferralCode = nanoid(10).toUpperCase()

    const { data: newUser, error: insertError } = await supabase
      .from('referral_users')
      .insert({
        wallet_address: newUserWallet,
        referral_code: newReferralCode,
        total_points: 0,
        total_referrals: 0,
      })
      .select()
      .single()

    if (insertError || !newUser) {
      console.log('[v0] Error creating user:', insertError)
      return Response.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    console.log('[v0] Created new user:', newUser.id)

    // Record the referral
    await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_wallet: newUserWallet,
    })

    // Update referrer's points and referral count
    const newPoints = (referrer.total_points || 0) + 100
    const newReferralCount = (referrer.total_referrals || 0) + 1

    await supabase
      .from('referral_users')
      .update({
        total_points: newPoints,
        total_referrals: newReferralCount,
      })
      .eq('id', referrer.id)

    console.log('[v0] Referral tracked successfully, gave 100 points')

    return Response.json({
      success: true,
      message: 'Referral tracked successfully',
      newUserCode: newReferralCode,
    })
  } catch (error) {
    console.error('[v0] Error tracking referral:', error)
    return Response.json(
      { error: 'Failed to track referral', details: String(error) },
      { status: 500 }
    )
  }
}
