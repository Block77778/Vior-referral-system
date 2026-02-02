import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { wallet, referrer } = await req.json()

    if (!wallet || !referrer) {
      return NextResponse.json(
        { ok: false, message: 'Missing wallet or referrer' },
        { status: 400 }
      )
    }

    // Check if referral already exists
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('wallet', wallet)
      .single()

    if (existing) {
      return NextResponse.json(
        { ok: false, message: 'Referral already claimed' },
        { status: 409 }
      )
    }

    // Insert referral
    const { error } = await supabase.from('referrals').insert({
      wallet,
      referrer,
    })

    if (error) {
      console.error(error)
      return NextResponse.json(
        { ok: false, message: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { ok: true, message: 'Referral recorded successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Referral Claim Error]', error)
    return NextResponse.json(
      { ok: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
