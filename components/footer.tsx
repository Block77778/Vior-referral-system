'use client'

import Link from 'next/link'
import { Twitter, Github, Mail, Send, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a1f1a] border-t border-[#00d4aa]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00d4aa]/70 flex items-center justify-center">
                <span className="text-[#0a1f1a] text-sm font-bold">V</span>
              </div>
              <span className="font-bold text-xl text-[#ffffff]">VIOR</span>
            </div>
            <p className="text-[#b0d4cc] text-sm">
              Real-world business backed Solana token merging profitability with blockchain.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="https://twitter.com/Vior_Coin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#132b24] border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] hover:border-[#00d4aa]/50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com/viorcoin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#132b24] border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] hover:border-[#00d4aa]/50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#132b24] border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] hover:border-[#00d4aa]/50 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#ffffff]">Product</h4>
            <ul className="space-y-2 text-[#b0d4cc]">
              <li><Link href="#trading" className="hover:text-[#00d4aa] transition-colors">Buy VIOR</Link></li>
              <li><Link href="#trading" className="hover:text-[#00d4aa] transition-colors">Swap Token</Link></li>
              <li><Link href="#whitepaper" className="hover:text-[#00d4aa] transition-colors">Whitepaper</Link></li>
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Contract: 6jx3HU...s4EL</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#ffffff]">Community</h4>
            <ul className="space-y-2 text-[#b0d4cc]">
              <li><Link href="/airdrop" className="hover:text-[#00d4aa] transition-colors">Airdrop</Link></li>
              <li><Link href="https://twitter.com/Vior_Coin" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4aa] transition-colors">Twitter (X)</Link></li>
              <li><Link href="https://instagram.com/viorcoin" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4aa] transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Medium Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#ffffff]">Legal</h4>
            <ul className="space-y-2 text-[#b0d4cc]">
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Disclaimer</Link></li>
              <li><Link href="#" className="hover:text-[#00d4aa] transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12 p-8 rounded-2xl border border-[#00d4aa]/30 bg-[#132b24]/50">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#ffffff] mb-2">Stay Updated</h3>
            <p className="text-[#b0d4cc] mb-6">Subscribe to receive the latest updates about VIOR.</p>
            <form className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#ffffff] placeholder-[#b0d4cc]/50 focus:outline-none focus:border-[#00d4aa]/50"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-lg hover:shadow-[#00d4aa]/40 transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#00d4aa]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#b0d4cc] text-sm">
            © 2025 VIOR. All rights reserved. Built on Solana.
          </div>
          <div className="flex gap-6 text-[#b0d4cc] text-sm">
            <Link href="#" className="hover:text-[#00d4aa] transition-colors">Status</Link>
            <Link href="#" className="hover:text-[#00d4aa] transition-colors">Sitemap</Link>
            <Link href="#" className="hover:text-[#00d4aa] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
