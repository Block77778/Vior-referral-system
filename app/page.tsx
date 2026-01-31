'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Hero from '@/components/hero'
import Ecosystem from '@/components/ecosystem'
import Products from '@/components/products'
import Tokenomics from '@/components/tokenomics'
import Trading from '@/components/trading'
import Roadmap from '@/components/roadmap'
import Whitepaper from '@/components/whitepaper'
import Footer from '@/components/footer'
import { useWallet } from '@/components/wallet-context'

export default function Home() {
  const { connectWallet, connected, publicKey } = useWallet()

  return (
    <main className="min-h-screen bg-[#0a1f1a] overflow-hidden">
      <Header connectWallet={connectWallet} connected={connected} publicKey={publicKey} />
      <Hero />
      <Ecosystem />
      <Products />
      <Tokenomics />
      <Trading />
      <Roadmap />
      <Whitepaper />
      <Footer />
    </main>
  )
}
