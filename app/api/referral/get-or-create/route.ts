import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    if (!walletAddress) {
      return Response.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('referral_users')
      .select('*')
      .eq('wallet_address', walletAddress)

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      return Response.json({
        referral_code: existingUser.referral_code,
        referral_url: `${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${existingUser.referral_code}`,
        points: existingUser.total_points || 0,
      })
    }

    // Create new referral user
    const referralCode = nanoid(10).toUpperCase()

    const { data: newUser, error } = await supabase
      .from('referral_users')
      .insert({
        wallet_address: walletAddress,
        referral_code: referralCode,
        total_points: 0,
        total_referrals: 0,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({
      referral_code: newUser.referral_code,
      referral_url: `${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${newUser.referral_code}`,
      points: newUser.total_points || 0,
    })
  } catch (error) {
    console.error('[v0] Error in get-or-create referral:', error)
    return Response.json(
      { error: 'Failed to get or create referral code' },
      { status: 500 }
    )
  }
}
