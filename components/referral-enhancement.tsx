'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Copy, Check, AlertCircle, RefreshCw, TrendingUp, Users, Zap } from 'lucide-react'

interface ReferralStats {
  referral_code: string
  points: number
  referrals_count: number
  lastUpdated?: string
}

interface ErrorState {
  message: string
  type: 'error' | 'success' | 'warning'
  timestamp: number
}

export function ReferralEnhancement({
  onStatsUpdate,
  referralCode,
}: {
  onStatsUpdate?: (stats: ReferralStats) => void
  referralCode?: string
}) {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [error, setError] = useState<ErrorState | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch stats with error handling
  const fetchStats = useCallback(async (code: string) => {
    if (!code || !code.trim()) {
      console.log('[v0] Skipping stats fetch - no code provided')
      return
    }

    try {
      setIsRefreshing(true)
      console.log('[v0] Fetching stats for code:', code)
      const response = await fetch(`/api/referral/stats?code=${encodeURIComponent(code)}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch stats (${response.status})`)
      }

      const updatedStats: ReferralStats = {
        referral_code: data.referral_code || code,
        points: data.points || 0,
        referrals_count: data.referrals_count || 0,
        lastUpdated: new Date().toISOString(),
      }

      console.log('[v0] Stats fetched successfully:', updatedStats)
      setStats(updatedStats)
      onStatsUpdate?.(updatedStats)

      // Clear any errors on success
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error fetching stats:', errorMsg)

      setError({
        message: `Unable to fetch stats: ${errorMsg}`,
        type: 'error',
        timestamp: Date.now(),
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [onStatsUpdate])

  // Set up auto-refresh
  useEffect(() => {
    if (referralCode && referralCode.trim()) {
      console.log('[v0] Starting stats refresh for code:', referralCode)
      fetchStats(referralCode)

      // Auto-refresh every 15 seconds
      refreshIntervalRef.current = setInterval(() => {
        fetchStats(referralCode)
      }, 15000)

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
        }
      }
    } else {
      console.log('[v0] No referral code provided to ReferralEnhancement')
    }
  }, [referralCode, fetchStats])

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }

      errorTimeoutRef.current = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
        }
      }
    }
  }, [error])

  // Handle manual code submission
  const handleManualCodeSubmit = async () => {
    if (!manualCode.trim()) return

    setIsSubmittingCode(true)
    try {
      const response = await fetch('/api/referral/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: manualCode.trim().toUpperCase(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to apply referral code')
      }

      setError({
        message: 'Referral code applied successfully!',
        type: 'success',
        timestamp: Date.now(),
      })

      setManualCode('')
      setShowManualInput(false)

      // Refresh stats if we have a code
      if (referralCode) {
        fetchStats(referralCode)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError({
        message: errorMsg,
        type: 'error',
        timestamp: Date.now(),
      })
    } finally {
      setIsSubmittingCode(false)
    }
  }

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!stats?.lastUpdated) return 'Never'

    const now = new Date()
    const updated = new Date(stats.lastUpdated)
    const secondsAgo = Math.floor((now.getTime() - updated.getTime()) / 1000)

    if (secondsAgo < 60) return `${secondsAgo}s ago`
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`
    return `${Math.floor(secondsAgo / 3600)}h ago`
  }

  return (
    <div className="space-y-4">
      {/* Error/Success Messages */}
      {error && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in ${
            error.type === 'error'
              ? 'bg-[#ff6b6b]/10 border-[#ff6b6b]/30'
              : error.type === 'success'
                ? 'bg-[#00d4aa]/10 border-[#00d4aa]/30'
                : 'bg-[#ffd93d]/10 border-[#ffd93d]/30'
          }`}
        >
          <AlertCircle
            size={20}
            className={
              error.type === 'error'
                ? 'text-[#ff6b6b] mt-0.5'
                : error.type === 'success'
                  ? 'text-[#00d4aa] mt-0.5'
                  : 'text-[#ffd93d] mt-0.5'
            }
          />
          <p
            className={
              error.type === 'error'
                ? 'text-[#ff6b6b] text-sm'
                : error.type === 'success'
                  ? 'text-[#00d4aa] text-sm'
                  : 'text-[#ffd93d] text-sm'
            }
          >
            {error.message}
          </p>
        </div>
      )}

      {/* Loading State */}
      {!stats && !error && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-[#00d4aa]/20 bg-[#132b24]/30 animate-pulse">
            <div className="h-4 bg-[#00d4aa]/20 rounded w-16 mb-3"></div>
            <div className="h-8 bg-[#00d4aa]/20 rounded w-20"></div>
          </div>
          <div className="p-4 rounded-xl border border-[#00d4aa]/20 bg-[#132b24]/30 animate-pulse">
            <div className="h-4 bg-[#00d4aa]/20 rounded w-16 mb-3"></div>
            <div className="h-8 bg-[#00d4aa]/20 rounded w-20"></div>
          </div>
        </div>
      )}

      {/* Real-time Stats Display */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {/* Points Card */}
          <div className="p-4 rounded-xl border border-[#00d4aa]/20 bg-[#132b24]/30 hover:border-[#00d4aa]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00d4aa]" />
                <span className="text-xs font-semibold text-[#b0d4cc] uppercase">Points</span>
              </div>
              {isRefreshing && <RefreshCw size={14} className="animate-spin text-[#00d4aa]" />}
            </div>
            <p className="text-2xl font-bold text-[#00d4aa]">{stats.points}</p>
            <p className="text-xs text-[#b0d4cc]/60 mt-1">Last updated: {getTimeSinceUpdate()}</p>
          </div>

          {/* Referrals Card */}
          <div className="p-4 rounded-xl border border-[#00d4aa]/20 bg-[#132b24]/30 hover:border-[#00d4aa]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#00d4aa]" />
                <span className="text-xs font-semibold text-[#b0d4cc] uppercase">Referred</span>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-[#00d4aa]/20 text-[#00d4aa] font-bold">
                +{stats.referrals_count}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#00d4aa]">{stats.referrals_count}</p>
            <p className="text-xs text-[#b0d4cc]/60 mt-1">People you referred</p>
          </div>
        </div>
      )}

      {/* Manual Referral Code Input */}
      <div className="p-4 rounded-lg border border-[#00d4aa]/20 bg-[#132b24]/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#00d4aa]" />
            <span className="text-sm font-semibold text-[#b0d4cc]">Have a referral code?</span>
          </div>
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-xs text-[#00d4aa] hover:text-[#00d4aa]/80 font-semibold transition-colors"
          >
            {showManualInput ? 'Hide' : 'Enter manually'}
          </button>
        </div>

        {showManualInput && (
          <div className="space-y-2 mt-3 pt-3 border-t border-[#00d4aa]/10">
            <input
              type="text"
              placeholder="Enter referral code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              disabled={isSubmittingCode}
              className="w-full px-3 py-2 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#00d4aa] placeholder-[#00d4aa]/40 font-mono text-sm focus:border-[#00d4aa] focus:outline-none focus:ring-1 focus:ring-[#00d4aa]/30 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleManualCodeSubmit}
              disabled={!manualCode.trim() || isSubmittingCode}
              className="w-full px-3 py-2 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-semibold text-sm hover:shadow-lg hover:shadow-[#00d4aa]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmittingCode ? 'Applying...' : 'Apply Code'}
            </button>
            <p className="text-xs text-[#b0d4cc]/60">
              Enter a code from a friend to earn bonus points
            </p>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => referralCode && fetchStats(referralCode)}
        disabled={isRefreshing}
        className="w-full px-3 py-2 rounded-lg border border-[#00d4aa]/20 bg-[#132b24]/30 text-[#00d4aa] text-sm font-semibold hover:border-[#00d4aa] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        Refresh Stats
      </button>
    </div>
  )
}
