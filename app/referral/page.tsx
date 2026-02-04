'use client'
export const dynamic = "force-dynamic"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Copy, Check, Share2, Trophy, Users, Target, Zap, LogOut, AlertCircle, RefreshCw } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useWallet } from '@/components/wallet-context'
import { ReferralEnhancement } from '@/components/referral-enhancement'
import { PointsRedemption } from '@/components/points-redemption'

interface UserStats {
  referral_code: string
  points: number
  referrals_count: number
}

interface LeaderboardEntry {
  rank: number
  referral_code: string
  points: number
  referrals_count: number
}

export default function ReferralPage() {
  const { connected, publicKey, connectWallet, disconnectWallet } = useWallet()

  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [referralLink, setReferralLink] = useState('')
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [manualRefCode, setManualRefCode] = useState('')
  const [showManualCodeInput, setShowManualCodeInput] = useState(false)
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | ''>('')

  // Generate referral link only on client when code is available
  useEffect(() => {
    if (typeof window !== 'undefined' && userStats?.referral_code) {
      const link = `${window.location.origin}/?ref=${userStats.referral_code}`
      setReferralLink(link)
    }
  }, [userStats?.referral_code])

  // Track wallet connection status
  useEffect(() => {
    if (connected) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('disconnected')
    }
  }, [connected])

  // Fetch leaderboard on mount and periodically refresh
  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Auto-generate code and fetch stats when wallet connects
  useEffect(() => {
    if (connected && publicKey && !userStats && !isGenerating) {
      handleGenerateCode()
    }
  }, [connected, publicKey])

  // Auto-refresh user stats periodically
  useEffect(() => {
    if (userStats?.referral_code && connected) {
      const interval = setInterval(() => {
        fetchUserStats(userStats.referral_code)
      }, 15000) // Refresh stats every 15 seconds
      return () => clearInterval(interval)
    }
  }, [userStats?.referral_code, connected])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/referral/leaderboard?limit=10')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      }
    } catch (error) {
      console.log('[v0] Error fetching leaderboard:', error)
    } finally {
      setLeaderboardLoading(false)
    }
  }

  const fetchUserStats = async (referralCode: string) => {
    if (!referralCode || !referralCode.trim()) {
      console.log('[v0] Skipping fetch - no referral code')
      return
    }

    try {
      console.log('[v0] Fetching stats for code:', referralCode)
      const response = await fetch(`/api/referral/stats?code=${encodeURIComponent(referralCode)}`)
      const data = await response.json()

      if (response.ok && data.referral_code) {
        setUserStats({
          referral_code: data.referral_code,
          points: data.points || 0,
          referrals_count: data.referrals_count || 0,
        })
        console.log('[v0] User stats updated:', data)
      } else {
        console.warn('[v0] Failed to fetch stats:', data.error || response.status)
      }
    } catch (error) {
      console.error('[v0] Error fetching user stats:', error)
    }
  }

  const handleGenerateCode = async () => {
    if (!publicKey) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/referral/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats({
          referral_code: data.referral_code,
          points: data.points || 0,
          referrals_count: data.referrals_count || 0,
        })
        // Fetch fresh stats to ensure we have the latest data
        fetchUserStats(data.referral_code)
      } else {
        const error = await response.json()
        console.error('[v0] Error generating code:', error)
      }
    } catch (error) {
      console.error('[v0] Error generating code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitManualCode = async () => {
    if (!manualRefCode.trim()) return

    setIsSubmittingCode(true)
    try {
      // Call the redeem-code endpoint to apply the referral code
      const response = await fetch('/api/referral/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey,
          referralCode: manualRefCode.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setManualRefCode('')
        setShowManualCodeInput(false)
        // Refresh stats
        if (userStats) {
          fetchUserStats(userStats.referral_code)
        }
      } else {
        alert(data.error || 'Failed to apply referral code')
      }
    } catch (error) {
      console.error('[v0] Error submitting referral code:', error)
      alert('Error applying referral code')
    } finally {
      setIsSubmittingCode(false)
    }
  }

  const handleCopyCode = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareTwitter = () => {
    if (referralLink) {
      const text = `Join me on VIOR Coin! Use my referral link to earn points and get exclusive rewards. ${referralLink}`
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        '_blank'
      )
    }
  }

  const handleRedeemPoints = async (option: any, amount: number) => {
    if (!publicKey || !userStats) {
      throw new Error('Please connect your wallet first')
    }

    try {
      const response = await fetch('/api/referral/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey,
          referralCode: userStats.referral_code,
          redemptionType: option.id,
          pointsAmount: amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Redemption failed')
      }

      // Update local stats after successful redemption
      setUserStats({
        ...userStats,
        points: (userStats.points || 0) - amount,
      })

      return data
    } catch (error) {
      throw error
    }
  }

  return (
    <main className="min-h-screen bg-[#0a1f1a] overflow-hidden">
      <Header />

      <div className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#00d4aa]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 mb-4">
              <span className="text-[#00d4aa] font-bold text-sm">REFERRAL PROGRAM</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-4">
              Earn Points & Rewards
            </h1>
            <p className="text-xl text-[#b0d4cc] max-w-2xl mx-auto">
              Invite your friends and earn points for every successful referral. Climb the
              leaderboard and unlock exclusive rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Wallet Connection Status */}
              {connectionStatus && (
                <div className={`p-4 rounded-xl border ${
                  connectionStatus === 'connected'
                    ? 'bg-[#00d4aa]/10 border-[#00d4aa]/30'
                    : 'bg-[#ff6b6b]/10 border-[#ff6b6b]/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-[#00d4aa]' : 'bg-[#ff6b6b]'
                    }`}></div>
                    <span className={`text-sm font-bold ${
                      connectionStatus === 'connected' ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'
                    }`}>
                      Wallet {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              )}

              {/* Always render referral section, only change content inside */}
              <div className="p-6 rounded-2xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24]/50 to-[#0a1f1a]/50 backdrop-blur-sm">
                {!connected ? (
                  <>
                    <h2 className="text-xl font-bold text-[#ffffff] mb-4">Connect Your Wallet</h2>
                    <p className="text-[#b0d4cc] text-sm mb-4">
                      Connect your Phantom wallet to get your unique referral code and start earning points.
                    </p>
                    <button
                      onClick={connectWallet}
                      className="w-full px-4 py-3 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-lg hover:shadow-[#00d4aa]/40 transition-all"
                    >
                      Connect Phantom Wallet
                    </button>
                    
                    {/* Manual Code Input for Users Without Link */}
                    <div className="mt-6 pt-6 border-t border-[#00d4aa]/20">
                      <h3 className="text-sm font-bold text-[#b0d4cc] mb-3">Have a referral code?</h3>
                      <button
                        onClick={() => setShowManualCodeInput(!showManualCodeInput)}
                        className="text-sm text-[#00d4aa] hover:text-[#00d4aa]/80 font-semibold"
                      >
                        {showManualCodeInput ? 'Hide' : 'Enter manually'}
                      </button>
                      
                      {showManualCodeInput && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Enter referral code"
                            value={manualRefCode}
                            onChange={(e) => setManualRefCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#00d4aa] placeholder-[#00d4aa]/40 font-mono text-sm focus:border-[#00d4aa] focus:outline-none"
                          />
                          <p className="text-xs text-[#b0d4cc]">You'll need to connect your wallet after entering the code</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : userStats ? (
                  <>
                    <h3 className="text-sm font-bold text-[#b0d4cc] mb-3 uppercase">
                      Your Referral Code
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={userStats.referral_code}
                        readOnly
                        className="flex-1 px-4 py-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#00d4aa] font-mono text-sm"
                      />
                      <button
                        onClick={handleCopyCode}
                        className="px-4 py-3 rounded-lg bg-[#132b24] border border-[#00d4aa]/20 text-[#00d4aa] hover:border-[#00d4aa] transition-all"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border border-[#00d4aa] border-t-[#d4af37]"></div>
                    <p className="text-[#b0d4cc] text-sm">Generating your referral code...</p>
                  </div>
                )}
              </div>

              {/* Link Display - Always render */}
              {userStats && (
                <div className="p-6 rounded-2xl border border-[#00d4aa]/20 bg-[#132b24]/30">
                  <h3 className="text-sm font-bold text-[#b0d4cc] mb-3 uppercase">
                    Share Your Link
                  </h3>
                  <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 break-all">
                    <p className="text-[#00d4aa] text-xs font-mono">
                      {referralLink || 'Generating link...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats with Enhancement Component */}
              {userStats && (
                <ReferralEnhancement
                  referralCode={userStats.referral_code}
                  onStatsUpdate={(stats) => {
                    setUserStats(stats)
                  }}
                />
              )}

              {/* Buttons */}
              {userStats && connected && (
                <div className="space-y-2">
                  <button
                    onClick={handleShareTwitter}
                    disabled={!referralLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D9BF0] text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Share2 size={18} />
                    Share on X
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#132b24] border border-[#ff6b6b]/20 text-[#ff6b6b] font-bold hover:border-[#ff6b6b] transition-all"
                  >
                    <LogOut size={18} />
                    Disconnect
                  </button>
                </div>
              )}

              {/* How it works */}
              <div className="p-6 rounded-2xl border border-[#00d4aa]/20 bg-[#132b24]/30">
                <h3 className="font-bold text-[#00d4aa] mb-4 flex items-center gap-2">
                  <Zap size={20} />
                  How It Works
                </h3>
                <ol className="space-y-3 text-sm text-[#b0d4cc]">
                  <li className="flex gap-3">
                    <span className="text-[#00d4aa] font-bold">1.</span>
                    <span>Share your referral code with friends</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00d4aa] font-bold">2.</span>
                    <span>They sign up using your code</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00d4aa] font-bold">3.</span>
                    <span>You earn 100 points per referral</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00d4aa] font-bold">4.</span>
                    <span>Redeem points for exclusive rewards</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-2xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24]/50 to-[#0a1f1a]/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={28} className="text-[#d4af37]" />
                  <h2 className="text-2xl font-bold text-[#ffffff]">Top Referrers</h2>
                </div>

                {leaderboardLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-[#132b24]/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`p-4 rounded-lg border ${
                          entry.rank === 1
                            ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#00d4aa]/20 border-[#d4af37]/40'
                            : entry.rank === 2
                              ? 'bg-gradient-to-r from-[#b0b0b0]/20 to-[#00d4aa]/20 border-[#b0b0b0]/40'
                              : entry.rank === 3
                                ? 'bg-gradient-to-r from-[#cd7f32]/20 to-[#00d4aa]/20 border-[#cd7f32]/40'
                                : 'bg-[#132b24]/30 border-[#00d4aa]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                entry.rank === 1
                                  ? 'bg-[#d4af37]/30 text-[#d4af37]'
                                  : entry.rank === 2
                                    ? 'bg-[#b0b0b0]/30 text-[#b0b0b0]'
                                    : entry.rank === 3
                                      ? 'bg-[#cd7f32]/30 text-[#cd7f32]'
                                      : 'bg-[#00d4aa]/20 text-[#00d4aa]'
                              }`}
                            >
                              {entry.rank}
                            </div>
                            <div>
                              <p className="font-bold text-[#ffffff]">{entry.referral_code}</p>
                              <p className="text-sm text-[#b0d4cc]">{entry.referrals_count} referrals</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#00d4aa]">{entry.points}</p>
                            <p className="text-xs text-[#b0d4cc]">points</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#b0d4cc]">No referrers yet. Be the first!</p>
                  </div>
                )}
              </div>

              {/* Points Redemption Section */}
              {userStats && connected && (
                <div className="mt-8">
                  <PointsRedemption
                    userPoints={userStats.points}
                    referralCode={userStats.referral_code}
                    onRedeem={handleRedeemPoints}
                  />
                </div>
              )}

              {/* Rewards */}
              <div className="mt-8 p-6 rounded-2xl border border-[#00d4aa]/20 bg-[#132b24]/30">
                <h3 className="font-bold text-[#ffffff] mb-4">Reward Tiers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#0a1f1a]/50">
                    <span className="text-[#b0d4cc]">100 Points</span>
                    <span className="text-[#00d4aa] font-bold">1 VIOR Token</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#0a1f1a]/50">
                    <span className="text-[#b0d4cc]">500 Points</span>
                    <span className="text-[#00d4aa] font-bold">10 VIOR Tokens</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#0a1f1a]/50">
                    <span className="text-[#b0d4cc]">1000 Points</span>
                    <span className="text-[#00d4aa] font-bold">50 VIOR Tokens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
