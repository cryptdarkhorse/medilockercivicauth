"use client"

import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { LoginScreen } from "@/components/login-screen"
import { AuthDebug } from "@/components/auth-debug"
import { useUser } from '@civic/auth-web3/react'

export default function Home() {
  const { user, authStatus } = useUser()

  // Debug logging
  console.log('Auth Status:', authStatus)
  console.log('User:', user)
  console.log('Auth Status Type:', typeof authStatus)
  console.log('User Type:', typeof user)

  // Handle loading state
  if (authStatus === 'LOADING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Get wallet address from different possible properties
  const getWalletAddress = () => {
    if (!user) return null
    
    // Try different possible wallet address properties
    const walletAddress = user.walletAddress || 
                         user.wallet?.address || 
                         user.address || 
                         user.publicKey
    
    // If no wallet address found, generate a fallback based on user ID
    if (!walletAddress && user.id) {
      // Create a deterministic wallet address from user ID
      const hash = user.id.split('').reduce((a: number, b: string) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      return `0x${Math.abs(hash).toString(16).padStart(40, '0')}`
    }
    
    return walletAddress
  }

  const walletAddress = getWalletAddress()

  // Check if user is authenticated - be more flexible with status values
  const isAuthenticated = user && (
    authStatus === 'AUTHENTICATED' || 
    authStatus === 'authenticated' || 
    authStatus === 'AUTHENTICATED_USER' ||
    authStatus === 'SIGNED_IN' ||
    authStatus === 'signed_in' ||
    authStatus === 'LOGGED_IN' ||
    authStatus === 'logged_in'
  )

  console.log('Is Authenticated:', isAuthenticated)

  return (
    <main>
      <Header />
      <div className="p-8">
        {isAuthenticated ? (
          <Dashboard walletAddress={walletAddress} />
        ) : (
          <LoginScreen />
        )}
      </div>
      <AuthDebug />
    </main>
  )
}
