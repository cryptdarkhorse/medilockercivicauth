"use client"

import { useUser, UserButton } from '@civic/auth-web3/react'

export function AuthDebug() {
  const { user, authStatus } = useUser()

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-sm space-y-1">
        <div>Status: <span className="font-mono">{authStatus}</span></div>
        <div>User: <span className="font-mono">{user ? 'Logged in' : 'Not logged in'}</span></div>
        {user && (
          <>
            <div>User ID: <span className="font-mono text-xs">{user.id}</span></div>
            <div>Email: <span className="font-mono text-xs">{user.email}</span></div>
            <div>Wallet Address: <span className="font-mono text-xs">{user.walletAddress || 'Not available'}</span></div>
            <div>User Object: <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-20">{JSON.stringify(user, null, 2)}</pre></div>
          </>
        )}
        <div className="mt-2">
          <UserButton />
        </div>
      </div>
    </div>
  )
} 