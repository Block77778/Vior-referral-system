import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { referralCode, walletAddress } = await request.json()

    if (!referralCode || !walletAddress) {
      return Response.json(
        { message: 'Missing referral code or wallet address' },
        { status: 400 }
      )
    }

    // Find the referrer by code
    const { data: referrerData, error: referrerError } = await supabase
      .from('referral_users')
      .select('*')
      .eq('referral_code', referralCode)
      .single()

    if (referrerError || !referrerData) {
      console.error('[v0] Error finding referrer:', referrerError)
      return Response.json(
        { message: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Check if this wallet already used this referral code
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', referrerData.id)
      .eq('referred_wallet', walletAddress)
      .single()

    if (existingReferral) {
      return Response.json(
        { message: 'You have already used this referral code' },
        { status: 400 }
      )
    }

    // Get or create referred user
    let referredUserId: string | null = null
    const { data: referredUserData } = await supabase
      .from('referral_users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single()

    if (referredUserData) {
      referredUserId = referredUserData.id
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerData.id,
        referred_wallet: walletAddress,
        referred_user_id: referredUserId,
        points_earned: 100,
        status: 'completed',
      })

    if (referralError) {
      console.error('[v0] Error creating referral record:', referralError)
      return Response.json(
        { message: 'Failed to process referral' },
        { status: 500 }
      )
    }

    // Update referrer's points and count
    const { data: currentData } = await supabase
      .from('referral_users')
      .select('total_points, total_referrals')
      .eq('id', referrerData.id)
      .single()

    if (currentData) {
      const { error: updateError } = await supabase
        .from('referral_users')
        .update({
          total_points: (currentData.total_points || 0) + 100,
          total_referrals: (currentData.total_referrals || 0) + 1,
        })
        .eq('id', referrerData.id)

      if (updateError) {
        console.error('[v0] Error updating referrer points:', updateError)
      }
    }

    return Response.json(
      { 
        success: true,
        message: 'Referral code applied successfully',
        referrer: referrerData.referral_code,
        pointsEarned: 100,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Redeem code error:', error)
    return Response.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
