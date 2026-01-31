'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

function ReferralCaptureContent() {
  const params = useSearchParams()

  useEffect(() => {
    const ref = params.get('ref')
    if (ref) {
      // Check if referral cookie already exists
      const existingRef = getCookie('referrer_code')
      
      if (!existingRef) {
        // Set cookie that expires in 30 days
        setCookie('referrer_code', ref, 30)
        console.log('[v0] Stored referrer code:', ref)
      }
    }
  }, [params])

  return null
}

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length)
    }
  }
  return null
}

export default function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <ReferralCaptureContent />
    </Suspense>
  )
}
