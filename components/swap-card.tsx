'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from './wallet-context'

const PRIVATE_SALE_WALLET = '7x8pZDmg8gLyP9x17viHmt2hwEmcQqX4pfx3xqNmDtnF'

// Dedicated RPC endpoints for transactions (more reliable ones)
const TRANSACTION_RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
  'https://rpc.ankr.com/solana',
]

export default function SwapCard({ mode }: { mode: 'swap' | 'buy' }) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { connected, publicKey, connectWallet, balance, getBalance, isBalanceLoading, rpcStatus } = useWallet()

  // Refresh balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      console.log('[SwapCard] Connected, refreshing balance...')
      refreshBalance()
    }
  }, [connected, publicKey])

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return
    try {
      await getBalance(publicKey)
    } catch (err) {
      console.error('[SwapCard] Balance refresh error:', err)
    }
  }, [publicKey, getBalance])

  const handleConnect = async () => {
    try {
      setError('')
      await connectWallet()
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
    }
  }

  // Function to get a working connection for transactions
  const getWorkingConnection = async () => {
    const { Connection } = await import('@solana/web3.js')
    
    for (const endpoint of TRANSACTION_RPC_ENDPOINTS) {
      try {
        console.log(`[Transaction] Trying endpoint: ${endpoint}`)
        const connection = new Connection(endpoint, 'confirmed')
        
        // Test the connection by getting recent blockhash
        const blockhash = await connection.getRecentBlockhash()
        console.log(`[Transaction] Endpoint ${endpoint} works, blockhash: ${blockhash.blockhash.slice(0, 10)}...`)
        
        return connection
      } catch (error) {
        console.warn(`[Transaction] Endpoint ${endpoint} failed:`, error)
        continue
      }
    }
    
    throw new Error('All transaction endpoints failed. Please try again later.')
  }

  const handleTransaction = async () => {
    if (!connected) {
      await handleConnect()
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const solAmount = Number(amount)
    const MIN_SOL = 0.001
    
    if (solAmount < MIN_SOL) {
      setError(`Minimum send amount is ${MIN_SOL} SOL`)
      return
    }
    
    // Check balance with buffer
    const requiredAmount = solAmount + 0.0005
    
    if (requiredAmount > balance) {
      setError(`Insufficient balance. You have ${balance.toFixed(4)} SOL but need ${solAmount} SOL + fee`)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      
      if (!phantom) {
        throw new Error('Phantom wallet not found')
      }

      if (!phantom.isConnected) {
        throw new Error('Wallet not connected. Please reconnect.')
      }

      console.log('[SwapCard] Starting transaction...')
      
      // Get a working connection
      const connection = await getWorkingConnection()
      const { Transaction, SystemProgram, PublicKey } = await import('@solana/web3.js')
      
      const fromPubkey = new PublicKey(publicKey!)
      const toPubkey = new PublicKey(PRIVATE_SALE_WALLET)
      
      const lamports = Math.floor(solAmount * 1_000_000_000)
      
      console.log(`[Transaction] Sending ${solAmount} SOL (${lamports} lamports) from ${fromPubkey.toString()} to ${toPubkey.toString()}`)

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      )

      // Get recent blockhash with retry
      let blockhash
      try {
        const blockhashResponse = await connection.getRecentBlockhash()
        blockhash = blockhashResponse.blockhash
        console.log('[Transaction] Got blockhash:', blockhash.slice(0, 10) + '...')
      } catch (blockhashError: any) {
        console.error('[Transaction] Failed to get blockhash:', blockhashError)
        throw new Error(`Failed to prepare transaction: ${blockhashError.message}`)
      }

      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPubkey

      console.log('[Transaction] Transaction prepared, requesting signature...')

      // Request signature from Phantom
      const { signature } = await phantom.signAndSendTransaction(transaction)
      console.log('[Transaction] Transaction signed, signature:', signature)

      // Wait for confirmation with timeout
      console.log('[Transaction] Waiting for confirmation...')
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature, 'confirmed'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
        )
      ])

      console.log('[Transaction] Transaction confirmed:', confirmation)
      
      setSuccess(`Successfully sent ${solAmount} SOL! Transaction confirmed.`)
      setAmount('')
      
      // Refresh balance after successful transaction
      setTimeout(() => {
        refreshBalance()
      }, 2000)

    } catch (err: any) {
      console.error('[SwapCard] Transaction error:', err)
      
      if (err.code === 4001 || err.message?.includes('rejected') || err.message?.includes('User denied')) {
        setError('Transaction cancelled by user')
      } else if (err.message?.includes('blockhash') || err.message?.includes('403')) {
        setError('Network error: Please try again in a few moments')
      } else if (err.message?.includes('Insufficient')) {
        setError('Insufficient balance for transaction and fees')
      } else {
        setError(err.message || 'Transaction failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Alternative simple transaction method using Phantom's built-in methods
  const handleSimpleTransaction = async () => {
    if (!connected) {
      await handleConnect()
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const solAmount = Number(amount)
    const MIN_SOL = 0.001
    
    if (solAmount < MIN_SOL) {
      setError(`Minimum send amount is ${MIN_SOL} SOL`)
      return
    }
    
    const requiredAmount = solAmount + 0.0005
    
    if (requiredAmount > balance) {
      setError(`Insufficient balance. You have ${balance.toFixed(4)} SOL but need ${solAmount} SOL + fee`)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      
      if (!phantom) {
        throw new Error('Phantom wallet not found')
      }

      console.log('[SimpleTransaction] Using Phantom send method...')

      // Method 1: Try Phantom's sendSol method if available
      if (phantom.sendSol) {
        const lamports = Math.floor(solAmount * 1_000_000_000)
        console.log(`[SimpleTransaction] Sending ${solAmount} SOL (${lamports} lamports)`)
        
        const signature = await phantom.sendSol({
          recipient: PRIVATE_SALE_WALLET,
          amount: lamports,
        })
        
        console.log('[SimpleTransaction] Transaction sent:', signature)
        setSuccess(`Successfully sent ${solAmount} SOL! Signature: ${signature.slice(0, 10)}...`)
        setAmount('')
        
        setTimeout(() => {
          refreshBalance()
        }, 2000)
        return
      }

      // Method 2: Try the transaction method above
      await handleTransaction()

    } catch (err: any) {
      console.error('[SimpleTransaction] Error:', err)
      
      if (err.code === 4001 || err.message?.includes('rejected')) {
        setError('Transaction cancelled by user')
      } else {
        setError(err.message || 'Transaction failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[#00d4aa]/30 bg-[#132b24] p-4 sm:p-6 space-y-4">
      {/* RPC Status */}
      <div className={`p-2 rounded text-xs ${
        rpcStatus.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
        rpcStatus.includes('Connected') ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
        'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
      }`}>
        RPC Status: {rpcStatus}
      </div>

      <div className="p-3 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#b0d4cc] text-xs sm:text-sm space-y-2">
        <p className="font-medium text-[#00d4aa]">Private Sale - Send SOL</p>
        <p>1. Enter amount of SOL to send</p>
        <p>2. Click "Send to Private Wallet" - Phantom will confirm</p>
        <p className="text-[#ffffff]">Wallet: <span className="text-[#00d4aa] break-all">{PRIVATE_SALE_WALLET}</span></p>
      </div>

      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-[#b0d4cc]">Your SOL Balance:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-[#00d4aa]">
              {isBalanceLoading ? 'Loading...' : `${balance.toFixed(4)} SOL`}
            </span>
            <button
              onClick={refreshBalance}
              disabled={isBalanceLoading || !connected}
              className="text-[#00d4aa] hover:text-[#ffffff] text-xs disabled:opacity-50"
            >
              ↻
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#ffffff] mb-2">
          Send Amount (SOL)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          min="0.001"
          step="0.001"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/20 text-[#ffffff] placeholder-[#b0d4cc]/50 focus:outline-none focus:border-[#00d4aa]/50 text-sm sm:text-base"
        />
      </div>

      <div className="p-3 rounded-lg bg-[#0a1f1a] border border-[#00d4aa]/10 space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between text-[#b0d4cc]">
          <span>Receiving Address</span>
          <span className="text-[#00d4aa] text-xs">{PRIVATE_SALE_WALLET.slice(0, 6)}...</span>
        </div>
        <div className="flex justify-between text-[#b0d4cc]">
          <span>Estimated Fee</span>
          <span className="text-[#00d4aa]">~0.00025 SOL</span>
        </div>
        <div className="flex justify-between text-[#b0d4cc]">
          <span>Available (after fee)</span>
          <span className="text-[#00d4aa]">{(balance - 0.00025).toFixed(4)} SOL</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          ✓ {success}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleSimpleTransaction}
          disabled={isLoading || isBalanceLoading}
          className="w-full py-3 rounded-lg bg-[#00d4aa] text-[#0a1f1a] font-bold hover:shadow-lg hover:shadow-[#00d4aa]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading ? 'Processing...' : connected ? 'Send to Private Wallet' : 'Connect Wallet'}
        </button>
        
        <div className="text-xs text-[#b0d4cc] text-center">
          {connected ? `Connected: ${publicKey?.slice(0, 6)}...` : 'No Wallet Connected'}
        </div>
      </div>
    </div>
  )
}
