"use client"

import { CivicAuthProvider as RealCivicAuthProvider } from '@civic/auth-web3/react'

export function CivicAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!

  if (!clientId) {
    console.error('NEXT_PUBLIC_CIVIC_CLIENT_ID is required')
    return <div>Error: Civic Client ID not configured</div>
  }

  console.log('Civic Auth Provider initialized with client ID:', clientId)

  return (
    <RealCivicAuthProvider 
      clientId={clientId}
      redirectUrl={typeof window !== 'undefined' ? window.location.origin : '/'}
      config={{
        enableWalletConnection: true,
        enableEmbeddedWallet: true,
      }}
    >
      {children}
    </RealCivicAuthProvider>
  )
}
