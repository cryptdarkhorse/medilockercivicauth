"use client"

import { WalletProvider } from "@solana/wallet-adapter-react"
import { CivicAuthProvider } from "./providers/civic-provider"
// Optionally import wallet adapters
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // const wallets = [new PhantomWalletAdapter()]
  const wallets: any[] = []

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <CivicAuthProvider>
        {children}
      </CivicAuthProvider>
    </WalletProvider>
  )
}