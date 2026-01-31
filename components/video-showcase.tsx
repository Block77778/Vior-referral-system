'use client'

import { Play } from 'lucide-react'
import { useState } from 'react'

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f1a] via-[#132b24] to-[#0a1f1a]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00d4aa] opacity-10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37] opacity-5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Experience VIOR
            <span className="block bg-gradient-to-r from-[#00d4aa] to-[#d4af37] bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[#b0d4cc] max-w-3xl mx-auto px-4">
            See how VIOR revolutionizes blockchain and real-world business integration
          </p>
        </div>

        {/* Video Container */}
        <div className="relative group animate-fade-in-up animation-delay-200">
          <div className="relative rounded-3xl overflow-hidden border border-[#00d4aa]/30 hover:border-[#00d4aa]/60 transition-all duration-500 shadow-2xl hover:shadow-[#00d4aa]/30">
            {/* Background blur effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Video Element */}
            <video
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-11-19%20at%203.46.45%20AM-iSyPrtXkFG4HPeKcFnQYZ893b0hE1V.mp4"
              className="w-full h-auto aspect-video object-cover"
              controls
              poster="/vior-video-showcase.jpg"
            />

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 cursor-pointer" onClick={() => setIsPlaying(true)}>
                <div className="w-20 h-20 rounded-full bg-[#00d4aa] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-[#00d4aa]/50">
                  <Play size={32} className="text-[#0a1f1a] ml-1 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#00d4aa] opacity-5 blur-2xl rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#d4af37] opacity-5 blur-2xl rounded-full" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in-up animation-delay-400">
          <p className="text-[#b0d4cc] text-lg mb-6">
            Ready to be part of the VIOR revolution?
          </p>
          <a 
            href="#trading"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#00d4aa] to-[#00f0cc] text-[#0a1f1a] rounded-full font-bold hover:shadow-2xl hover:shadow-[#00d4aa]/50 hover:scale-105 transition-all duration-300 text-lg"
          >
            Start Trading
          </a>
        </div>
      </div>
    </section>
  )
}
