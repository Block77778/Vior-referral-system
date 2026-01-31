import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const REFERRAL_BONUS = 100 // Points awarded to referrer
const NEW_USER_BONUS = 25 // Optional bonus for new user

export async function POST(req: Request) {
  try {
    const { walletAddress, referrerCode } = await req.json()

    if (!walletAddress) {
      return Response.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate wallet format (basic check)
    if (!walletAddress.match(/^[0-9a-zA-Z]{32,}$/)) {
      return Response.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('referral_users')
      .select('id, referral_code, total_points')
      .eq('wallet_address', walletAddress)
      .single()

    if (existingUser) {
      return Response.json(
        {
          success: true,
          isNewUser: false,
          referral_code: existingUser.referral_code,
          total_points: existingUser.total_points || 0,
        },
        { status: 200 }
      )
    }

    // Create new user with unique referral code
    const referralCode = nanoid(10).toUpperCase()

    const { data: newUser, error: userError } = await supabase
      .from('referral_users')
      .insert({
        wallet_address: walletAddress,
        referral_code: referralCode,
        total_points: NEW_USER_BONUS, // Optional bonus for new users
        total_referrals: 0,
      })
      .select('id, referral_code, total_points')
      .single()

    if (userError) {
      console.error('[v0] Error creating user:', userError)
      throw new Error('Failed to create user')
    }

    // Process referral if referrerCode is provided
    if (referrerCode) {
      // Find the referrer
      const { data: referrer, error: referrerError } = await supabase
        .from('referral_users')
        .select('id, total_points, total_referrals')
        .eq('referral_code', referrerCode)
        .neq('wallet_address', walletAddress) // Prevent self-referral
        .single()

      if (referrer && !referrerError) {
        // Record the referral
        const { error: referralError } = await supabase
          .from('referrals')
          .insert({
            referrer_id: referrer.id,
            referred_wallet: walletAddress,
            referred_user_id: newUser.id,
            points_earned: REFERRAL_BONUS,
            status: 'confirmed',
          })

        if (!referralError) {
          // Award points to referrer - increment both total_points and total_referrals
          const { error: updateError } = await supabase
            .from('referral_users')
            .update({
              total_points: (referrer.total_points || 0) + REFERRAL_BONUS,
              total_referrals: (referrer.total_referrals || 0) + 1,
            })
            .eq('id', referrer.id)

          if (updateError) {
            console.error('[v0] Error updating referrer points:', updateError)
          } else {
            console.log('[v0] Referrer points awarded:', REFERRAL_BONUS, 'points to', referrer.id)
          }
        } else {
          console.error('[v0] Error recording referral:', referralError)
        }
      } else {
        console.warn('[v0] Referrer code not found or self-referral attempt:', referrerCode)
      }
    }

    return Response.json(
      {
        success: true,
        isNewUser: true,
        referral_code: newUser.referral_code,
        total_points: newUser.total_points,
        message: 'User created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error in create-user referral:', error)
    return Response.json(
      { error: 'Failed to create user account' },
      { status: 500 }
    )
  }
}
