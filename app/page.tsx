"use client"

import { useCivic } from "./providers/civic-provider"
import { Header } from "@/components/header"
import { LoginScreen } from "@/components/login-screen"
import { Dashboard } from "@/components/dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  const { isAuthenticated, isLoading } = useCivic()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {isAuthenticated ? <Dashboard /> : <LoginScreen />}
    </div>
  )
}
