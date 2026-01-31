'use client'

import { useRef, useEffect, useState } from 'react'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }, [])

  const scrollToSwap = () => {
    const swapElement = document.getElementById('trading')
    if (swapElement) {
      swapElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-11-19%20at%203.46.45%20AM-iSyPrtXkFG4HPeKcFnQYZ893b0hE1V.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f1a]/95 via-[#0a1f1a]/80 to-[#0a1f1a]/60" />

      {/* Content overlay - Added better mobile responsive padding and changed from items-center to items-start with justify-start */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-6 md:space-y-8 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4aa]/30 bg-[#00d4aa]/5 hover:border-[#00d4aa]/60 transition-all duration-300">
            <span className="w-2 h-2 bg-[#00d4aa] rounded-full animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-[#00d4aa]">Now on Solana Mainnet</span>
          </div>

          {/* Main Heading - Reduced sizes for mobile and improved line breaks */}
          <div className="space-y-3 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Real Business
              <br />
              <span className="bg-gradient-to-r from-[#00d4aa] via-[#00d4aa] to-[#d4af37] bg-clip-text text-transparent">
                Meets Blockchain
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#b0d4cc] leading-relaxed max-w-xl font-light">
              VIOR merges real-world business profitability with decentralized finance. Backed by tangible investments in car rentals, real estate, trading firms, and more.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 md:pt-6">
            <button 
              onClick={scrollToSwap}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#00d4aa]/50 hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              Buy Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#00d4aa]/50 text-[#00d4aa] font-bold hover:bg-[#00d4aa]/10 hover:border-[#00d4aa] transition-all duration-300 text-base sm:text-lg hover:shadow-lg hover:shadow-[#00d4aa]/20">
              Read Whitepaper
            </button>
          </div>

          {/* Stats - Responsive grid for mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 md:pt-8 border-t border-[#00d4aa]/20">
            <div className="hover:bg-[#00d4aa]/5 p-2 sm:p-3 rounded-lg transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-[#00d4aa]">10B</div>
              <div className="text-xs sm:text-sm text-[#b0d4cc]">Total Supply</div>
            </div>
            <div className="hover:bg-[#00d4aa]/5 p-2 sm:p-3 rounded-lg transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-[#00d4aa]">0%</div>
              <div className="text-xs sm:text-sm text-[#b0d4cc]">Buy/Sell Tax</div>
            </div>
            <div className="hover:bg-[#00d4aa]/5 p-2 sm:p-3 rounded-lg transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-[#00d4aa]">6+</div>
              <div className="text-xs sm:text-sm text-[#b0d4cc]">Sectors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#00d4aa] rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-[#00d4aa] rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
