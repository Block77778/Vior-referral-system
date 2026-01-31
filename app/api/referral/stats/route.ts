import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const referralCode = searchParams.get('code')

    if (!referralCode) {
      return Response.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // Get user and their stats
    const { data: users } = await supabase
      .from('referral_users')
      .select('*')
      .eq('referral_code', referralCode)

    if (!users || users.length === 0) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]

    return Response.json({
      referral_code: user.referral_code,
      points: user.total_points || 0,
      referrals_count: user.total_referrals || 0,
    })
  } catch (error) {
    console.error('[v0] Error getting referral stats:', error)
    return Response.json(
      { error: 'Failed to get referral stats' },
      { status: 500 }
    )
  }
}
