'use client'

export const dynamic = 'force-dynamic'

import { Suspense, lazy } from 'react'
import Header from '@/components/header'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import { useWallet } from '@/components/wallet-context'

// Lazy load heavy components
const Ecosystem = lazy(() => import('@/components/ecosystem'))
const Products = lazy(() => import('@/components/products'))
const Tokenomics = lazy(() => import('@/components/tokenomics'))
const Trading = lazy(() => import('@/components/trading'))
const Roadmap = lazy(() => import('@/components/roadmap'))
const Whitepaper = lazy(() => import('@/components/whitepaper'))

const LoadingFallback = () => <div className="h-screen bg-[#0a1f1a]" />

export default function Home() {
  const { connectWallet, connected, publicKey } = useWallet()

  return (
    <main className="min-h-screen bg-[#0a1f1a] overflow-hidden">
      <Header connectWallet={connectWallet} connected={connected} publicKey={publicKey} />
      <Hero />
      <Suspense fallback={<LoadingFallback />}>
        <Ecosystem />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Products />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Tokenomics />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Trading />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Roadmap />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Whitepaper />
      </Suspense>
      <Footer />
    </main>
  )
}
