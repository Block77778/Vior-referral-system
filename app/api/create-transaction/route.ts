import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { buyerPublicKey, amount, mode, tokenAddress } = await request.json()

    if (!buyerPublicKey || !amount || !mode || !tokenAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[v0] Creating transaction:', {
      buyer: buyerPublicKey,
      amount,
      mode,
      token: tokenAddress,
    })

    // In production, you would:
    // 1. Create a Solana transaction
    // 2. Transfer tokens from presale wallet to buyer
    // 3. Record the transaction in database
    // 4. Return the transaction details

    return NextResponse.json({
      success: true,
      transactionId: `vior_${Date.now()}`,
      buyer: buyerPublicKey,
      amount,
      mode,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Transaction error:', error)
    return NextResponse.json(
      { error: 'Transaction creation failed' },
      { status: 500 }
    )
  }
}
