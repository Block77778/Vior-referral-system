'use client'

const allocation = [
  { label: 'Private Sale', percentage: 15, amount: '1.5B', color: '#00d4aa', description: 'Early supporters and private investors' },
  { label: 'Presale', percentage: 25, amount: '2.5B', color: '#00a889', description: 'Public sale on official Vior website' },
  { label: 'Community & Airdrops', percentage: 20, amount: '2B', color: '#0090bb', description: 'Build and reward early supporters' },
  { label: 'Team & Advisors', percentage: 15, amount: '1.5B', color: '#00d4aa', description: 'Locked and vested for development team' },
  { label: 'Liquidity & Listings', percentage: 15, amount: '1.5B', color: '#00b894', description: 'DEX/CEX liquidity provisioning' },
  { label: 'Reserve Fund', percentage: 10, amount: '1B', color: '#666666', description: 'Future use, burns, or partnerships' },
]

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-20 px-4 sm:px-6 lg:px-8 scroll-section bg-[#132b24]/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#ffffff]">
            Token Allocation
          </h2>
          <p className="text-xl text-[#b0d4cc] max-w-2xl mx-auto">
            Strategic distribution designed for sustainable growth and community benefit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {allocation.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-xl border border-[#00d4aa]/30 bg-gradient-to-br from-[#132b24] to-[#0a1f1a] hover:border-[#00d4aa]/60 hover:shadow-lg hover:shadow-[#00d4aa]/20 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Color indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: item.color }}></div>

              {/* Percentage Circle */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00d4aa] transition-colors mb-2">
                    {item.label}
                  </h3>
                  <p className="text-sm text-[#b0d4cc]">{item.description}</p>
                </div>
                <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#00d4aa]/40 transition-all duration-300" style={{ backgroundColor: `${item.color}20`, border: `2px solid ${item.color}` }}>
                  <div className="text-center">
                    <div className="text-xl font-bold" style={{ color: item.color }}>
                      {item.percentage}%
                    </div>
                    <div className="text-xs" style={{ color: item.color }}>Allocation</div>
                  </div>
                </div>
              </div>

              {/* Token amount */}
              <div className="pt-4 border-t border-[#00d4aa]/20 group-hover:border-[#00d4aa]/50 transition-all">
                <div className="text-sm text-[#b0d4cc] mb-1">Token Amount</div>
                <div className="text-lg font-bold text-[#00d4aa]">{item.amount} VIOR</div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-2 rounded-full bg-[#00d4aa]/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Token Info */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-200">
            <div className="text-sm text-[#b0d4cc] mb-2">Token Name</div>
            <div className="text-2xl font-bold text-[#00d4aa]">Vior</div>
          </div>
          <div className="p-6 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-400">
            <div className="text-sm text-[#b0d4cc] mb-2">Ticker</div>
            <div className="text-2xl font-bold text-[#00d4aa]">VIOR</div>
          </div>
          <div className="p-6 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-600">
            <div className="text-sm text-[#b0d4cc] mb-2">Total Supply</div>
            <div className="text-2xl font-bold text-[#00d4aa]">10B</div>
          </div>
          <div className="p-6 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-800">
            <div className="text-sm text-[#b0d4cc] mb-2">Buy/Sell Tax</div>
            <div className="text-2xl font-bold text-[#00d4aa]">0%</div>
          </div>
        </div>

        {/* Additional Token Details */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-400">
            <h3 className="text-xl font-bold text-white mb-4">Network Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#b0d4cc]">Network</span>
                <span className="text-[#00d4aa] font-bold">Solana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#b0d4cc]">Token Type</span>
                <span className="text-[#00d4aa] font-bold">SPL Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#b0d4cc]">Decimals</span>
                <span className="text-[#00d4aa] font-bold">9</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl border border-[#00d4aa]/20 bg-[#0a1f1a] hover:border-[#00d4aa]/50 transition-all hover:shadow-lg hover:shadow-[#00d4aa]/10 animate-fade-in-up animation-delay-600">
            <h3 className="text-xl font-bold text-white mb-4">Security Features</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00d4aa]"></div>
                <span className="text-[#b0d4cc]">Liquidity Lock</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00d4aa]"></div>
                <span className="text-[#b0d4cc]">Third Party Audit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00d4aa]"></div>
                <span className="text-[#b0d4cc]">Transparent On-Chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
