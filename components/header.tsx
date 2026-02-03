"use client"

import { useState } from "react"
import Link from "next/link"
import { useWallet } from "@/components/wallet-context"

export default function Header() {
  const { connectWallet, connected, publicKey } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!connectWallet) return
    
    try {
      setIsConnecting(true)
      await connectWallet()
    } catch (error) {
      console.error('[v0] Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 animate-slide-down">
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-[#0a1f1a] via-[#132b24] to-[#0a1f1a]">
        <div className="absolute inset-0 bg-[#0a1f1a]/90 backdrop-blur-md"></div>
      </div>

      {/* Navigation content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#00d4aa]/20 flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 relative rounded-full flex items-center justify-center bg-[#00d4aa]/10 border border-[#00d4aa]/30">
              <img src="/vior-logo.png" alt="VIOR Token" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline group-hover:text-[#00d4aa] transition-colors duration-300">
              VIOR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Ecosystem", href: "#ecosystem" },
              { label: "Tokenomics", href: "#tokenomics" },
              { label: "Trading", href: "#trading" },
              { label: "Roadmap", href: "#roadmap" },
              { label: "Whitepaper", href: "#whitepaper" },
              { label: "Airdrop", href: "/airdrop" },
              { label: "Referral", href: "/referral" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-[#b0d4cc] hover:text-[#00d4aa] transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4aa] to-[#d4af37] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-6 py-2.5 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-xl hover:shadow-[#00d4aa]/40 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? "Connecting..." : connected ? `${publicKey?.slice(0, 6)}...` : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#00d4aa] p-2 hover:bg-[#00d4aa]/10 rounded-lg transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 pt-4 flex flex-col gap-4 animate-slide-down">
            {[
              { label: "Ecosystem", href: "#ecosystem" },
              { label: "Tokenomics", href: "#tokenomics" },
              { label: "Trading", href: "#trading" },
              { label: "Roadmap", href: "#roadmap" },
              { label: "Whitepaper", href: "#whitepaper" },
              { label: "Airdrop", href: "/airdrop" },
              { label: "Referral", href: "/referral" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-[#b0d4cc] hover:text-[#00d4aa] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full px-4 py-2.5 rounded-full bg-[#00d4aa] text-[#0a1f1a] font-bold mt-4 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? "Connecting..." : connected ? `${publicKey?.slice(0, 6)}...` : "Connect Wallet"}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
