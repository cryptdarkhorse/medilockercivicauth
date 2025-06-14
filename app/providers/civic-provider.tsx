"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Mock Civic Auth implementation for demo purposes
interface User {
  id: string
  name: string
  email: string
  walletAddress: string
}

interface CivicContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  isLoading: boolean
}

const CivicContext = createContext<CivicContextType | undefined>(undefined)

export function CivicAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("medilocker-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async () => {
    setIsLoading(true)
    // Simulate Civic Auth login
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@email.com",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    }

    setUser(mockUser)
    localStorage.setItem("medilocker-user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("medilocker-user")
  }

  return (
    <CivicContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </CivicContext.Provider>
  )
}

export function useCivic() {
  const context = useContext(CivicContext)
  if (context === undefined) {
    throw new Error("useCivic must be used within a CivicAuthProvider")
  }
  return context
}
