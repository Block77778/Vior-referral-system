'use client'

import { CheckCircle, Circle } from 'lucide-react'

const phases = [
  {
    quarter: 'Q4 2025',
    phase: 'Phase 1: Foundation',
    status: 'current',
    items: [
      'Token creation on Solana mainnet',
      'Website and social media launch',
      'Whitepaper release',
      'Private Sale'
    ]
  },
  {
    quarter: 'Q1 2026',
    phase: 'Phase 2: Growth',
    status: 'upcoming',
    items: [
      'Public Presale',
      'Raydium listing and liquidity lock',
      'CoinGecko and CoinMarketCap listings',
      'Marketing campaign'
    ]
  },
  {
    quarter: 'Q2-Q3 2026',
    phase: 'Phase 3: Expansion',
    status: 'upcoming',
    items: [
      'Airdrops and partnerships',
      'CEX listings',
      'Community roadmap update',
      'Ecosystem growth'
    ]
  },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 scroll-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#ffffff]">
            Development Roadmap
          </h2>
          <p className="text-xl text-[#b0d4cc] max-w-2xl mx-auto">
            Our strategic plan to build, launch, and scale VIOR
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
              {/* Connection Line */}
              {idx < phases.length - 1 && (
                <div className="hidden md:block absolute top-24 left-full w-8 h-0.5 bg-gradient-to-r from-[#00d4aa] to-transparent" />
              )}

              {/* Card */}
              <div className={`rounded-2xl border-2 p-8 min-h-[450px] ${
                phase.status === 'current'
                  ? 'border-[#00d4aa] bg-[#132b24]/50'
                  : 'border-[#00d4aa]/20 bg-[#0a1f1a]'
              }`}>
                {/* Status Indicator */}
                <div className="flex items-center gap-3 mb-4">
                  {phase.status === 'current' ? (
                    <div className="relative">
                      <span className="text-[#00d4aa]">✓</span>
                    </div>
                  ) : (
                    <span className="text-[#00d4aa]/40">○</span>
                  )}
                  <span className="text-sm font-semibold text-[#00d4aa] uppercase">{phase.quarter}</span>
                </div>

                {/* Phase Title */}
                <h3 className="text-2xl font-serif font-bold text-[#ffffff] mb-6">{phase.phase}</h3>

                {/* Items */}
                <ul className="space-y-3">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 text-[#b0d4cc]">
                      <span className="text-[#00d4aa] mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
