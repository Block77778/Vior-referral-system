import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get top referrers
    const { data: leaderboard, error } = await supabase
      .from('referral_users')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(limit)

    if (error) throw error

    const formattedLeaderboard = (leaderboard || []).map((user, index) => ({
      rank: index + 1,
      referral_code: user.referral_code,
      points: user.total_points || 0,
      referrals_count: user.total_referrals || 0,
    }))

    return Response.json({
      leaderboard: formattedLeaderboard,
    })
  } catch (error) {
    console.error('[v0] Error getting leaderboard:', error)
    return Response.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
