'use client'

import React from "react"

import { useState } from 'react'
import { Gift, Check, AlertCircle, Loader2, Copy, CheckCircle2 } from 'lucide-react'

interface RedemptionOption {
  id: string
  name: string
  description: string
  pointsRequired: number
  icon: React.ReactNode
  color: string
  borderColor: string
}

interface RedemptionProps {
  userPoints: number
  onRedeem?: (option: RedemptionOption, amount: number) => Promise<void>
  referralCode?: string
}

export function PointsRedemption({ userPoints = 0, onRedeem, referralCode }: RedemptionProps) {
  const [selectedRedemption, setSelectedRedemption] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [redeemStatus, setRedeemStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState(false)

  const redemptionOptions: RedemptionOption[] = [
    {
      id: 'token-discount',
      name: 'Token Discount',
      description: 'Redeem points for VIOR token discounts on purchases',
      pointsRequired: 100,
      icon: '💰',
      color: 'from-[#00d4aa]/20 to-[#00d4aa]/5',
      borderColor: 'border-[#00d4aa]/50',
    },
    {
      id: 'exclusive-nft',
      name: 'Exclusive NFTs',
      description: 'Unlock limited edition VIOR ecosystem NFTs',
      pointsRequired: 500,
      icon: '🎨',
      color: 'from-[#d4af37]/20 to-[#d4af37]/5',
      borderColor: 'border-[#d4af37]/50',
    },
    {
      id: 'airdrop-boost',
      name: 'Airdrop Boost',
      description: 'Multiply your airdrop allocation by 2x or 3x',
      pointsRequired: 250,
      icon: '🚀',
      color: 'from-[#00d4aa]/20 to-[#d4af37]/10',
      borderColor: 'border-[#00d4aa]/40',
    },
    {
      id: 'early-access',
      name: 'Early Access',
      description: 'Get early access to new products and features',
      pointsRequired: 150,
      icon: '⭐',
      color: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-400/40',
    },
    {
      id: 'referral-bonus',
      name: 'Referral Bonus',
      description: 'Boost your referral rewards by 50% for 30 days',
      pointsRequired: 300,
      icon: '🤝',
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-400/40',
    },
    {
      id: 'custom-amount',
      name: 'Custom Redemption',
      description: 'Redeem any amount of points (minimum 50)',
      pointsRequired: 50,
      icon: '✨',
      color: 'from-[#00d4aa]/15 to-[#00d4aa]/5',
      borderColor: 'border-[#00d4aa]/30',
    },
  ]

  const handleRedeem = async (option: RedemptionOption) => {
    if (!onRedeem) {
      setRedeemStatus({
        type: 'error',
        message: 'Redemption system not available',
      })
      return
    }

    let redeemPoints = option.pointsRequired
    if (option.id === 'custom-amount') {
      const amount = parseInt(customAmount)
      if (isNaN(amount) || amount < 50 || amount > userPoints) {
        setRedeemStatus({
          type: 'error',
          message: `Please enter a valid amount between 50 and ${userPoints}`,
        })
        return
      }
      redeemPoints = amount
    }

    if (userPoints < redeemPoints) {
      setRedeemStatus({
        type: 'error',
        message: `Insufficient points. You need ${redeemPoints - userPoints} more points.`,
      })
      return
    }

    setIsProcessing(true)
    try {
      await onRedeem(option, redeemPoints)
      setRedeemStatus({
        type: 'success',
        message: `Successfully redeemed ${redeemPoints} points for ${option.name}!`,
      })
      setSelectedRedemption(null)
      setCustomAmount('')
      setTimeout(() => {
        setRedeemStatus({ type: null, message: '' })
      }, 5000)
    } catch (error) {
      setRedeemStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Redemption failed. Please try again.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Points Summary Card */}
      <div className="rounded-2xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24]/50 to-[#0a1f1a]/50 backdrop-blur-sm p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm md:text-base text-[#b0d4cc] mb-2">Available Points</p>
            <h3 className="text-4xl md:text-5xl font-bold text-[#00d4aa] font-serif">{userPoints.toLocaleString()}</h3>
          </div>
          <div className="text-6xl">💎</div>
        </div>

        {/* Info and Instructions Toggle */}
        <div className="mt-6 pt-6 border-t border-[#00d4aa]/20">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 text-[#00d4aa] hover:text-[#00d4aa]/80 font-semibold text-sm md:text-base transition-colors"
          >
            <span className="text-lg">{showInstructions ? '−' : '+'}</span>
            {showInstructions ? 'Hide' : 'Show'} Redemption Instructions
          </button>

          {showInstructions && (
            <div className="mt-4 space-y-3 text-sm text-[#b0d4cc]">
              <div className="flex gap-3">
                <div className="text-[#00d4aa] font-bold mt-0.5">1.</div>
                <div>
                  <p className="font-semibold text-white mb-1">Select a Redemption Option</p>
                  <p>Choose how you want to redeem your points from the available options below.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[#00d4aa] font-bold mt-0.5">2.</div>
                <div>
                  <p className="font-semibold text-white mb-1">Verify the Amount</p>
                  <p>Ensure you have enough points for the selected redemption option.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[#00d4aa] font-bold mt-0.5">3.</div>
                <div>
                  <p className="font-semibold text-white mb-1">Confirm Redemption</p>
                  <p>Click the redeem button and wait for confirmation. Your points will be deducted immediately.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[#00d4aa] font-bold mt-0.5">4.</div>
                <div>
                  <p className="font-semibold text-white mb-1">Receive Your Reward</p>
                  <p>Your reward will be processed and delivered to your wallet within 24 hours.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {redeemStatus.type && (
        <div
          className={`rounded-xl p-4 border flex items-start gap-3 ${
            redeemStatus.type === 'success'
              ? 'bg-[#00d4aa]/10 border-[#00d4aa]/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          {redeemStatus.type === 'success' ? (
            <CheckCircle2 className="text-[#00d4aa] mt-0.5 flex-shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
          )}
          <p className={redeemStatus.type === 'success' ? 'text-[#00d4aa]' : 'text-red-400'}>
            {redeemStatus.message}
          </p>
        </div>
      )}

      {/* Redemption Options Grid */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Gift size={24} className="text-[#00d4aa]" />
          Redemption Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {redemptionOptions.map((option) => {
            const isSelected = selectedRedemption === option.id
            const canRedeem = userPoints >= option.pointsRequired
            const isCustom = option.id === 'custom-amount'

            return (
              <div
                key={option.id}
                className={`rounded-xl border p-5 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  isSelected
                    ? `bg-gradient-to-br ${option.color} ${option.borderColor} border-2 ring-2 ring-[#00d4aa]/40`
                    : `bg-[#132b24]/30 border-[#00d4aa]/20 hover:border-[#00d4aa]/50 ${
                        !canRedeem ? 'opacity-50 cursor-not-allowed' : ''
                      }`
                }`}
                onClick={() => canRedeem && setSelectedRedemption(option.id)}
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{option.icon}</div>
                  {canRedeem && isSelected && <Check className="text-[#00d4aa]" size={20} />}
                </div>

                <h4 className="font-bold text-white mb-1 text-sm md:text-base">{option.name}</h4>
                <p className="text-xs md:text-sm text-[#b0d4cc] mb-4">{option.description}</p>

                {/* Points Required */}
                <div className="pt-4 border-t border-[#00d4aa]/20">
                  <p className="text-[#00d4aa] font-semibold text-sm">
                    {option.pointsRequired.toLocaleString()} points
                  </p>
                  <p className={`text-xs mt-1 ${canRedeem ? 'text-green-400' : 'text-red-400'}`}>
                    {canRedeem ? '✓ Available' : `Need ${option.pointsRequired - userPoints} more`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Amount Input */}
      {selectedRedemption === 'custom-amount' && (
        <div className="rounded-xl border border-[#00d4aa]/30 bg-[#132b24]/30 p-6">
          <label className="block text-sm font-semibold text-[#b0d4cc] mb-3">Enter Amount to Redeem</label>
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              type="number"
              min="50"
              max={userPoints}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Minimum 50 points"
              className="flex-1 px-4 py-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#00d4aa] placeholder-[#00d4aa]/40 focus:border-[#00d4aa] focus:outline-none"
            />
            <button
              onClick={() => setCustomAmount(userPoints.toString())}
              className="px-4 py-3 rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/50 text-[#00d4aa] hover:bg-[#00d4aa]/30 font-semibold text-sm whitespace-nowrap"
            >
              Max ({userPoints})
            </button>
          </div>
        </div>
      )}

      {/* Referral Code Display */}
      {referralCode && (
        <div className="rounded-xl border border-[#00d4aa]/30 bg-[#132b24]/30 p-5">
          <p className="text-sm text-[#b0d4cc] mb-2">Your Referral Code</p>
          <div className="flex gap-2 items-center">
            <div className="flex-1 px-4 py-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 font-mono text-[#00d4aa] text-sm md:text-base">
              {referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-3 rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/50 text-[#00d4aa] hover:bg-[#00d4aa]/30 transition-all"
              title="Copy referral code"
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col md:flex-row">
        <button
          onClick={() => {
            if (selectedRedemption) {
              const option = redemptionOptions.find((o) => o.id === selectedRedemption)
              if (option) {
                handleRedeem(option)
              }
            }
          }}
          disabled={!selectedRedemption || isProcessing}
          className="flex-1 px-6 py-4 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-xl hover:shadow-[#00d4aa]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Gift size={20} />
              Redeem Now
            </>
          )}
        </button>

        {selectedRedemption && (
          <button
            onClick={() => {
              setSelectedRedemption(null)
              setCustomAmount('')
            }}
            className="flex-1 px-6 py-4 rounded-lg border-2 border-[#00d4aa]/50 text-[#00d4aa] font-bold hover:bg-[#00d4aa]/10 transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a]/50 p-4 text-xs md:text-sm text-[#b0d4cc] space-y-2">
        <p>
          <span className="text-[#00d4aa] font-semibold">💡 Tip:</span> Accumulate more referrals to earn bonus points
          and unlock exclusive redemption tiers!
        </p>
        <p>
          <span className="text-[#00d4aa] font-semibold">📱 Support:</span> Questions? Contact our support team for
          assistance with redemptions.
        </p>
      </div>
    </div>
  )
}
