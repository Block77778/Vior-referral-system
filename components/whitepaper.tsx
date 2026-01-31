'use client'

import { FileText, Download, ExternalLink, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const whitepaperSections = [
  {
    title: 'Introduction',
    content: 'Vior (Ticker: VIOR) is a Solana-based digital asset designed to merge real-world business profitability with blockchain technology. Instead of relying solely on speculation or hype, Vior is backed by tangible investments in diverse business sectors — ensuring long-term value creation and ecosystem stability.',
  },
  {
    title: 'Our Model',
    content: 'Use collective investments to build real businesses — and use the profits from those businesses to support and grow the Vior token. This unique integration of traditional business income with decentralized finance creates a hybrid ecosystem where investors and holders both benefit from real economic activity.',
  },
  {
    title: 'Mission',
    content: 'To launch a token on Solana that prioritizes accessibility and fairness. To establish strong community and investor confidence through open communication. To expand Vior\'s potential through strategic partnerships and utilities in the future.',
  },
  {
    title: 'Economic Vision',
    content: 'Vior combines blockchain transparency with real business profitability. By aligning investor interests with the ecosystem\'s success, Vior aims to create a self-sustaining growth loop — where business expansion drives token strength, and token strength fuels business growth.',
  },
]

export default function Whitepaper() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0)

  return (
    <section id="whitepaper" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#132b24]/50 scroll-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00d4aa]/20 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-[#00d4aa]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#ffffff]">
              Whitepaper
            </h2>
          </div>
          <p className="text-lg md:text-xl text-[#b0d4cc] max-w-3xl mx-auto">
            THE BEGINNING OF A NEW DIGITAL ASSET ON SOLANA
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left - Expandable Sections */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up">
            {whitepaperSections.map((section, idx) => (
              <div
                key={idx}
                className="border border-[#00d4aa]/30 rounded-xl overflow-hidden bg-[#0a1f1a] hover:border-[#00d4aa]/60 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#00d4aa]/5 transition-colors duration-200"
                >
                  <h3 className="text-lg font-bold text-[#ffffff] text-left">{section.title}</h3>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#00d4aa] transition-transform duration-300 flex-shrink-0 ${
                      expandedSection === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSection === idx && (
                  <div className="px-6 pb-4 border-t border-[#00d4aa]/20">
                    <p className="text-[#b0d4cc] leading-relaxed">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right - Highlights */}
          <div className="space-y-4 animate-fade-in-right animation-delay-200">
            <div className="p-6 rounded-xl border border-[#00d4aa]/30 bg-[#0a1f1a] hover:border-[#00d4aa]/60 transition-all duration-300">
              <div className="text-sm text-[#00d4aa] font-bold mb-2">REAL BUSINESSES</div>
              <p className="text-[#b0d4cc]">Car rentals, real estate, perfumes, mobile apps, education, and trading firms.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#00d4aa]/30 bg-[#0a1f1a] hover:border-[#00d4aa]/60 transition-all duration-300">
              <div className="text-sm text-[#00d4aa] font-bold mb-2">TRANSPARENCY</div>
              <p className="text-[#b0d4cc]">All transactions verifiable on-chain with 0% buy/sell tax and locked liquidity.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#00d4aa]/30 bg-[#0a1f1a] hover:border-[#00d4aa]/60 transition-all duration-300">
              <div className="text-sm text-[#00d4aa] font-bold mb-2">COMMUNITY LED</div>
              <p className="text-[#b0d4cc]">Community voting, utility proposals, and ecosystem integrations on Solana.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
