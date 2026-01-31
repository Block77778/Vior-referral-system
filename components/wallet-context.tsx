'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getReferralCodeFromCookie, clearReferralCookie } from '@/lib/referral'

interface WalletContextType {
  connected: boolean
  publicKey: string | null
  wallet: any
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  balance: number
  getBalance: (publicKeyString: string) => Promise<number>
  isBalanceLoading: boolean
  rpcStatus: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Public RPC endpoints that don't require API keys
const RPC_ENDPOINTS = [
  {
    url: 'https://api.mainnet-beta.solana.com',
    name: 'Solana Mainnet'
  },
  {
    url: 'https://solana-api.projectserum.com',
    name: 'Project Serum'
  },
  {
    url: 'https://api.solflare.com',
    name: 'Solflare'
  }
]

// Custom fetch with timeout and retries
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// Direct RPC call function
const directRpcCall = async (endpoint: string, method: string, params: any[] = []) => {
  try {
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    }, 15000) // 15 second timeout

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`)
    }
    
    return data.result
  } catch (error) {
    console.warn(`[RPC] Direct call failed for ${endpoint}:`, error)
    throw error
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [rpcStatus, setRpcStatus] = useState<string>('Checking...')

  // Test RPC connection
  const testRpcConnection = useCallback(async (endpoint: string): Promise<boolean> => {
    try {
      console.log(`[RPC] Testing connection to: ${endpoint}`)
      const result = await directRpcCall(endpoint, 'getHealth')
      console.log(`[RPC] Connection successful to: ${endpoint}`)
      return true
    } catch (error) {
      console.warn(`[RPC] Connection failed to ${endpoint}:`, error)
      return false
    }
  }, [])

  // Find working RPC endpoint
  const findWorkingEndpoint = useCallback(async (): Promise<string | null> => {
    setRpcStatus('Finding working RPC endpoint...')
    
    for (const endpoint of RPC_ENDPOINTS) {
      const isWorking = await testRpcConnection(endpoint.url)
      if (isWorking) {
        setRpcStatus(`Connected to ${endpoint.name}`)
        console.log(`[RPC] Using endpoint: ${endpoint.name}`)
        return endpoint.url
      }
    }
    
    setRpcStatus('All RPC endpoints failed')
    return null
  }, [testRpcConnection])

  const getBalance = useCallback(async (publicKeyString: string): Promise<number> => {
    if (!publicKeyString) {
      console.log('[Balance] No public key provided')
      setBalance(0)
      return 0
    }

    setIsBalanceLoading(true)
    console.log('[Balance] Fetching balance for:', publicKeyString)

    try {
      // Validate public key
      const publicKey = new PublicKey(publicKeyString)
      console.log('[Balance] Public key validated:', publicKey.toString())

      // Try direct RPC calls first
      for (const endpoint of RPC_ENDPOINTS) {
        try {
          console.log(`[Balance] Trying direct RPC to: ${endpoint.name}`)
          const result = await directRpcCall(endpoint.url, 'getBalance', [publicKeyString])
          
          if (result && typeof result.value === 'number') {
            const solBalance = result.value / 1_000_000_000
            console.log(`[Balance] Success with ${endpoint.name}:`, solBalance, 'SOL')
            setRpcStatus(`Balance from ${endpoint.name}`)
            setBalance(solBalance)
            return solBalance
          }
        } catch (error) {
          console.warn(`[Balance] Failed with ${endpoint.name}:`, error)
          continue
        }
      }

      // If direct RPC fails, try Web3.js connection with timeout
      console.log('[Balance] Trying Web3.js connection...')
      const workingEndpoint = await findWorkingEndpoint()
      
      if (workingEndpoint) {
        const connection = new Connection(workingEndpoint, 'confirmed')
        const balance = await Promise.race([
          connection.getBalance(publicKey),
          new Promise<number>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ])
        
        const solBalance = balance / 1_000_000_000
        console.log('[Balance] Web3.js success:', solBalance, 'SOL')
        setBalance(solBalance)
        return solBalance
      }

      throw new Error('All balance fetch methods failed')

    } catch (error: any) {
      console.error('[Balance] All methods failed:', error)
      setRpcStatus('Failed to fetch balance')
      
      // Final fallback - try a public API
      try {
        console.log('[Balance] Trying public API fallback...')
        const response = await fetchWithTimeout(
          `https://public-api.solscan.io/account/${publicKeyString}`,
          {},
          10000
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.lamports) {
            const solBalance = data.lamports / 1_000_000_000
            console.log('[Balance] Public API success:', solBalance, 'SOL')
            setBalance(solBalance)
            setRpcStatus('Balance from public API')
            return solBalance
          }
        }
      } catch (apiError) {
        console.warn('[Balance] Public API also failed:', apiError)
      }
      
      setBalance(0)
      return 0
    } finally {
      setIsBalanceLoading(false)
    }
  }, [findWorkingEndpoint])

  // Initialize wallet connection
  useEffect(() => {
    const initWallet = async () => {
      // Test RPC connection on startup (non-blocking)
      findWorkingEndpoint().catch(error => {
        console.warn('[RPC] Failed to find working endpoint during init:', error)
        setRpcStatus('Using fallback mode')
      })

      const phantom = (window as any).phantom?.solana || (window as any).solana
      
      if (phantom?.isPhantom) {
        setWallet(phantom)
        console.log('[Wallet] Phantom wallet detected')

        // Check if already connected
        try {
          const response = await phantom.connect({ onlyIfTrusted: true })
          if (response.publicKey) {
            const pubKeyString = response.publicKey.toString()
            console.log('[Wallet] Auto-connected to:', pubKeyString)
            setConnected(true)
            setPublicKey(pubKeyString)
            // Get balance but don't block if it fails
            getBalance(pubKeyString).catch(error => {
              console.warn('[Wallet] Failed to get balance on init:', error)
            })
          }
        } catch (error) {
          console.log('[Wallet] Not previously connected')
        }

        // Set up event listeners
        phantom.on('connect', (publicKey: PublicKey) => {
          const pubKeyString = publicKey.toString()
          console.log('[Wallet] Connected:', pubKeyString)
          setConnected(true)
          setPublicKey(pubKeyString)
          getBalance(pubKeyString)

          // Create user account with referral tracking
          const createUser = async () => {
            try {
              const response = await fetch('/api/referral/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  walletAddress: pubKeyString,
                  referrerCode: getReferralCodeFromCookie() || null,
                })
              })
              
              const data = await response.json()
              
              if (response.ok && data.success) {
                console.log('[Wallet] User account created with referral:', data)
                // Clear referral cookie after successful account creation
                if (data.isNewUser) {
                  clearReferralCookie()
                }
              } else {
                console.warn('[Wallet] User creation or referral processing failed:', data)
              }
            } catch (error) {
              console.error('[Wallet] Error creating user account:', error)
            }
          }
          
          createUser()
        })

        phantom.on('disconnect', () => {
          console.log('[Wallet] Disconnected')
          setConnected(false)
          setPublicKey(null)
          setBalance(0)
        })

        phantom.on('accountChanged', (publicKey: PublicKey | null) => {
          if (publicKey) {
            const pubKeyString = publicKey.toString()
            console.log('[Wallet] Account changed:', pubKeyString)
            setPublicKey(pubKeyString)
            getBalance(pubKeyString)
          } else {
            console.log('[Wallet] Account disconnected')
            setConnected(false)
            setPublicKey(null)
            setBalance(0)
          }
        })
      } else {
        console.warn('[Wallet] Phantom wallet not found')
        setRpcStatus('Phantom wallet not detected')
      }
    }

    initWallet()

    return () => {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      if (phantom) {
        phantom.removeAllListeners()
      }
    }
  }, [getBalance, findWorkingEndpoint])

  const connectWallet = async () => {
    try {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      
      if (!phantom) {
        window.open('https://phantom.app/', '_blank')
        throw new Error('Phantom wallet not installed')
      }

      console.log('[Wallet] Connecting to Phantom...')
      const response = await phantom.connect()
      
      if (response.publicKey) {
        const pubKeyString = response.publicKey.toString()
        console.log('[Wallet] Connection successful:', pubKeyString)
      }
    } catch (error: any) {
      console.error('[Wallet] Connection failed:', error)
      if (error.code === 4001) {
        throw new Error('Connection rejected by user')
      }
      throw error
    }
  }

  const disconnectWallet = () => {
    try {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      if (phantom) {
        phantom.disconnect()
      }
    } catch (error) {
      console.error('[Wallet] Disconnect error:', error)
    }
  }

  return (
    <WalletContext.Provider value={{ 
      connected, 
      publicKey, 
      wallet, 
      connectWallet, 
      disconnectWallet, 
      balance, 
      getBalance,
      isBalanceLoading,
      rpcStatus
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
