import React from "react"
import { Inter, Playfair_Display } from 'next/font/google'
import { WalletProvider } from '@/components/wallet-context'
import ReferralCapture from '@/components/referral-capture'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata = {
  title: 'VIOR - Real-World Business Backed Solana Token',
  description: 'VIOR: A Solana SPL token merging real-world business profitability with blockchain technology. Buy VIOR presale backed by car rentals, real estate, perfumes, and more.',
  keywords: 'VIOR, Solana, SPL Token, Presale, Buy Crypto, Blockchain Investment',
  openGraph: {
    title: 'VIOR - Real-World Business Backed Token',
    description: 'Merging real-world business profitability with blockchain technology. Buy VIOR now on presale.',
    images: ['vior-logo.jpg'],
  },
    generator: 'v0.app'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  themeColor: '#0a1f1a'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable}`}>
      <body className={inter.className}>
        <WalletProvider>
          <ReferralCapture />
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}


import './globals.css'
