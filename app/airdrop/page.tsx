'use client'
export const dynamic = "force-dynamic"

import React, { useState, useEffect } from "react"

import Link from 'next/link'
import { Twitter, Instagram, Clock, CheckCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function AirdropPage() {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateCountdown = () => {
      // January 22nd, 2026 at 00:00 GMT
      const deadline = new Date('2026-01-22T00:00:00Z').getTime()
      const now = new Date().getTime()
      const difference = deadline - now

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a1f1a] overflow-hidden">
      <Header />
      
      {/* Airdrop Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#00d4aa] hover:text-[#00d4aa]/80 transition-colors mb-8"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-4">
                  Free VIOR Airdrop
                </h1>
                <p className="text-xl text-[#b0d4cc]">
                  Get 1000 free VIOR tokens! Follow us on X and Instagram, then comment your Phantom wallet address on our airdrop posts to claim.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#00d4aa]">How to Claim:</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-[#ffffff] mb-1">Follow on X (Twitter)</h3>
                      <p className="text-[#b0d4cc]">Follow @Vior_Coin on X for the latest updates</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-[#ffffff] mb-1">Follow on Instagram</h3>
                      <p className="text-[#b0d4cc]">Follow @viorcoin on Instagram</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-[#ffffff] mb-1">Comment Your Wallet</h3>
                      <p className="text-[#b0d4cc]">Comment your Phantom Solana wallet address on the airdrop posts</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-[#ffffff] mb-1">Claim Before Deadline</h3>
                      <p className="text-[#b0d4cc]">Comment before January 22nd, 2026 at 00:00 GMT to receive your airdrop</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://twitter.com/Vior_Coin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#132b24] border border-[#00d4aa]/30 text-[#00d4aa] hover:border-[#00d4aa] hover:bg-[#1a3a32] transition-all"
                >
                  <Twitter size={20} />
                  <span>Follow on X</span>
                </a>
                <a
                  href="https://instagram.com/viorcoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#132b24] border border-[#00d4aa]/30 text-[#00d4aa] hover:border-[#00d4aa] hover:bg-[#1a3a32] transition-all"
                >
                  <Instagram size={20} />
                  <span>Follow on IG</span>
                </a>
              </div>
            </div>

            {/* Right Side - Info Cards */}
            <div className="space-y-6 animate-fade-in-right">
              {/* Main Reward Card */}
              <div className="p-8 rounded-2xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24]/50 to-[#0a1f1a]/50 backdrop-blur-sm">
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 mb-4">
                    <span className="text-[#00d4aa] font-bold">Reward: 1000 VIOR</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-[#ffffff] mb-3">Next Steps:</h3>
                    <ol className="space-y-3 text-[#b0d4cc]">
                      <li className="flex gap-3">
                        <span className="text-[#00d4aa] font-bold">1.</span>
                        <span>Head over to our X post and comment your Phantom wallet address</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#00d4aa] font-bold">2.</span>
                        <span>Also comment on our Instagram airdrop post with your wallet address</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#00d4aa] font-bold">3.</span>
                        <span>Claim before January 22nd, 2026 at 00:00 GMT</span>
                      </li>
                    </ol>
                  </div>

                  <div className="pt-4 border-t border-[#00d4aa]/20">
                    <p className="text-[#b0d4cc] text-sm mb-4">
                      Click below to go to our social media posts:
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://twitter.com/Vior_Coin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-lg hover:shadow-[#00d4aa]/40 transition-all"
                      >
                        <Twitter size={18} />
                        <span>Go to X Post</span>
                      </a>
                      <a
                        href="https://instagram.com/viorcoin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-lg hover:shadow-[#00d4aa]/40 transition-all"
                      >
                        <Instagram size={18} />
                        <span>Go to IG Post</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer Card */}
              <div className="p-6 rounded-2xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24]/50 to-[#0a1f1a]/50">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00d4aa]/20 border border-[#00d4aa]/50 flex-shrink-0">
                    <Clock size={24} className="text-[#00d4aa]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#00d4aa] mb-3">Airdrop Deadline</h3>
                    <p className="text-[#b0d4cc] text-sm mb-4">
                      Claim before January 22nd, 2026 at 00:00 GMT
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-center">
                        <div className="text-2xl font-bold text-[#00d4aa]">
                          {countdown.days}
                        </div>
                        <div className="text-xs text-[#b0d4cc] mt-1">Days</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-center">
                        <div className="text-2xl font-bold text-[#00d4aa]">
                          {countdown.hours}
                        </div>
                        <div className="text-xs text-[#b0d4cc] mt-1">Hours</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-center">
                        <div className="text-2xl font-bold text-[#00d4aa]">
                          {countdown.minutes}
                        </div>
                        <div className="text-xs text-[#b0d4cc] mt-1">Minutes</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-center">
                        <div className="text-2xl font-bold text-[#00d4aa]">
                          {countdown.seconds}
                        </div>
                        <div className="text-xs text-[#b0d4cc] mt-1">Seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="p-6 rounded-2xl border border-[#00d4aa]/20 bg-[#132b24]/30">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00d4aa]/20 border border-[#00d4aa]/50 flex-shrink-0">
                    <CheckCircle size={24} className="text-[#00d4aa]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00d4aa] mb-2">Requirements:</h3>
                    <ul className="space-y-1 text-[#b0d4cc] text-sm">
                      <li>✓ Follow @Vior_Coin on X</li>
                      <li>✓ Follow @viorcoin on Instagram</li>
                      <li>✓ Comment your valid Phantom wallet address on both posts</li>
                      <li>✓ Have an active Phantom wallet</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
