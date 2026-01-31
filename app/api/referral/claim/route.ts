import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(req: Request) {
  try {
    const { user, referrer } = await req.json()

    // Validate input
    if (!user || !referrer) {
      return NextResponse.json(
        { error: 'Missing user or referrer' },
        { status: 400 }
      )
    }

    // Prevent self-referral
    if (user.toLowerCase() === referrer.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      )
    }

    // Check if referral already exists
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_wallet', user.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { ok: true, message: 'Referral already recorded' },
        { status: 200 }
      )
    }

    // Insert referral
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: null, // Will be set by trigger or manually
        referred_wallet: user.toLowerCase(),
        referrer_wallet: referrer.toLowerCase(),
      })

    if (insertError) {
      console.error('[v0] Error inserting referral:', insertError)
      return NextResponse.json(
        { error: 'Failed to record referral' },
        { status: 500 }
      )
    }

    // Find referrer's record and update points
    const { data: referrerData } = await supabase
      .from('referral_users')
      .select('id')
      .eq('wallet_address', referrer.toLowerCase())
      .single()

    if (referrerData) {
      // Get current data to calculate new values
      const { data: currentData } = await supabase
        .from('referral_users')
        .select('total_points, total_referrals')
        .eq('id', referrerData.id)
        .single()

      if (currentData) {
        // Increment referrer's points and count
        const { error: updateError } = await supabase
          .from('referral_users')
          .update({
            total_points: (currentData.total_points || 0) + 100,
            total_referrals: (currentData.total_referrals || 0) + 1,
          })
          .eq('id', referrerData.id)
          .select()

        if (updateError) {
          console.error('[v0] Error updating referrer points:', updateError)
        }
      }
    }

    // Create referral user record for the referred user
    const { error: newUserError } = await supabase
      .from('referral_users')
      .insert({
        wallet_address: user.toLowerCase(),
        referral_code: `REF-${user.slice(2, 8).toUpperCase()}`,
        total_points: 0,
        total_referrals: 0,
      })

    if (newUserError && !newUserError.message.includes('duplicate')) {
      console.error('[v0] Error creating user:', newUserError)
    }

    return NextResponse.json(
      { ok: true, message: 'Referral recorded successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in referral claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
