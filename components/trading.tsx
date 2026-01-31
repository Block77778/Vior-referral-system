'use client'

import { useState } from 'react'
import { ArrowUpDown, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import SwapCard from './swap-card'

export default function Trading() {
  return (
    <section id="trading" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#132b24]/50 scroll-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Trade VIOR
          </h2>
          <p className="text-xl text-[#b0d4cc] max-w-2xl mx-auto">
            Buy VIOR or participate in our private sale
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SwapCard mode="swap" />
        </div>

        <div className="max-w-4xl mx-auto mt-12 space-y-6">
          {/* Manual Transaction Instructions */}
          <div className="p-6 rounded-xl border border-[#00d4aa]/30 bg-[#0a1f1a]">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-1" />
              <h3 className="font-bold text-[#ffffff] text-lg">Having Issues? Send SOL Manually</h3>
            </div>
            
            <p className="text-[#b0d4cc] text-sm mb-6">
              If you're experiencing issues with the automatic transaction window, you can manually send SOL to our private sale wallet. Your contribution will be recorded on the blockchain and you'll receive your VIOR tokens automatically after the private sale ends.
            </p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-4 mb-6">
              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Open Your Wallet</p>
                    <p className="text-[#b0d4cc] text-xs">Open Phantom, Backpack, or any Solana-compatible wallet that supports sending SOL transactions.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Copy the Private Sale Wallet Address</p>
                    <div className="bg-[#0a1f1a] p-2 rounded border border-[#00d4aa]/20 mb-2">
                      <p className="text-[#00d4aa] text-xs break-all font-mono">7x8pZDmg8gLyP9x17viHmt2hwEmcQqX4pfx3xqNmDtnF</p>
                    </div>
                    <p className="text-[#b0d4cc] text-xs">Click the wallet address above to copy it to your clipboard.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Click "Send" in Your Wallet</p>
                    <p className="text-[#b0d4cc] text-xs">In your wallet app, click the Send or Transfer button.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">4</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Paste the Address & Enter Amount</p>
                    <p className="text-[#b0d4cc] text-xs">Paste the private sale wallet address in the recipient field, and enter the amount of SOL you wish to contribute.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">5</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Review & Confirm the Transaction</p>
                    <p className="text-[#b0d4cc] text-xs">Double-check the amount and recipient address, then confirm the transaction.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">6</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Wait for Transaction Confirmation</p>
                    <p className="text-[#b0d4cc] text-xs">The transaction will take a few seconds to confirm on the Solana blockchain. Your wallet will show the confirmation once complete.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#132b24]/50 p-4 rounded-lg border border-[#00d4aa]/20">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa] text-[#0a1f1a] flex items-center justify-center font-bold text-xs flex-shrink-0">7</div>
                  <div>
                    <p className="font-semibold text-[#ffffff] text-sm mb-1">Save Your Transaction Hash</p>
                    <p className="text-[#b0d4cc] text-xs">Save the transaction hash (TX ID) for your records. This proves your contribution to the private sale.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Distribution Info */}
            <div className="bg-[#00d4aa]/10 border border-[#00d4aa]/30 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#00d4aa] flex-shrink-0 mt-1" />
                <h4 className="font-semibold text-[#ffffff] text-sm">How You'll Receive Your VIOR Tokens</h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#b0d4cc]">
                <li className="flex gap-2">
                  <span className="text-[#00d4aa] flex-shrink-0">•</span>
                  <span><span className="font-semibold">Blockchain Recording:</span> Every SOL you send is recorded on the Solana blockchain to the private sale wallet.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00d4aa] flex-shrink-0">•</span>
                  <span><span className="font-semibold">Automatic Distribution:</span> After the private sale ends, VIOR tokens will be automatically distributed to your wallet address.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00d4aa] flex-shrink-0">•</span>
                  <span><span className="font-semibold">Proportional Allocation:</span> Your VIOR token share is calculated based on the exact amount of SOL you contributed during the private sale period.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00d4aa] flex-shrink-0">•</span>
                  <span><span className="font-semibold">No Additional Action Needed:</span> Simply send SOL and wait - the token distribution is automatic and contract-based.</span>
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
              <p className="font-semibold text-orange-400 text-sm mb-2">⚠️ Important Notes</p>
              <ul className="space-y-2 text-xs text-[#b0d4cc]">
                <li>• <span className="font-semibold">Always verify the wallet address</span> before sending - this is a critical security step</li>
                <li>• <span className="font-semibold">Transaction fees (~0.00025 SOL)</span> are standard Solana network fees and will be deducted automatically by your wallet</li>
                <li>• <span className="font-semibold">Keep your transaction ID</span> as proof of your participation in the private sale</li>
                <li>• <span className="font-semibold">Double-check the amount</span> you're sending to ensure it matches your intended contribution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="max-w-4xl mx-auto mt-8 p-4 rounded-xl border border-[#00d4aa]/20 bg-[#132b24]/50">
          <h4 className="font-semibold text-[#ffffff] mb-3 text-sm sm:text-base">About VIOR</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#b0d4cc]">
            <li className="flex gap-2">
              <span className="text-[#00d4aa] flex-shrink-0">•</span>
              <span>Always verify contract address before trading</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#00d4aa] flex-shrink-0">•</span>
              <span>0% buy/sell tax - all profits yours</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#00d4aa] flex-shrink-0">•</span>
              <span>Liquidity locked for security</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
