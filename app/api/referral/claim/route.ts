import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { user, referrer } = await req.json()

    // 1. Validate input
    if (!user || !referrer) {
      return NextResponse.json(
        { ok: false, message: 'Missing user or referrer' },
        { status: 400 }
      )
    }

    const userWallet = user.toLowerCase()
    const referrerWallet = referrer.toLowerCase()

    // 2. Prevent self-referral
    if (userWallet === referrerWallet) {
      return NextResponse.json(
        { ok: false, message: 'Self referral not allowed' },
        { status: 400 }
      )
    }

    // 3. Check if referral already exists
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_wallet', userWallet)
      .maybeSingle()

    if (existingReferral) {
      return NextResponse.json(
        { ok: true, message: 'Referral already claimed' },
        { status: 200 }
      )
    }

    // 4. Ensure referrer exists
    const { data: referrerUser } = await supabase
      .from('referral_users')
      .select('id')
      .eq('wallet_address', referrerWallet)
      .maybeSingle()

    if (!referrerUser) {
      return NextResponse.json(
        { ok: false, message: 'Invalid referrer' },
        { status: 400 }
      )
    }

    // 5. Insert referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_wallet: referrerWallet,
        referred_wallet: userWallet,
      })

    if (referralError) {
      console.error('[REFERRAL INSERT]', referralError)
      return NextResponse.json(
        { ok: false, message: 'Failed to record referral' },
        { status: 500 }
      )
    }

    // 6. Create user record if not exists
    await supabase
      .from('referral_users')
      .upsert({
        wallet_address: userWallet,
        referral_code: `REF-${userWallet.slice(2, 8).toUpperCase()}`,
        total_points: 25,
        total_referrals: 0,
      })

    // 7. Reward referrer
    const { data: referrerData } = await supabase
      .from('referral_users')
      .select('total_points, total_referrals')
      .eq('wallet_address', referrerWallet)
      .single()

    await supabase
      .from('referral_users')
      .update({
        total_points: (referrerData?.total_points || 0) + 25,
        total_referrals: (referrerData?.total_referrals || 0) + 1,
      })
      .eq('wallet_address', referrerWallet)

    // 8. Success response
    return NextResponse.json(
      { ok: true, message: 'Referral claimed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[CLAIM ERROR]', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
