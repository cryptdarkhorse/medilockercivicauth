"use client"

import { UserButton } from '@civic/auth-web3/react'

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">Medilocker</h1>
      <UserButton />
    </header>
  )
}
