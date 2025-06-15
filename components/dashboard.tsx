"use client"

import { useState, useEffect } from "react"
import { useUser } from '@civic/auth-web3/react'
import { UploadForm } from "./upload-form"
import { DocumentList } from "./document-list"
import { StatsCards } from "./stats-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, User } from "lucide-react"

interface DashboardProps {
  walletAddress?: string | null
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const { user } = useUser()
  const [showWalletAlert, setShowWalletAlert] = useState(false)

  // Check if wallet is connected
  useEffect(() => {
    if (!walletAddress) {
      setShowWalletAlert(true)
    }
  }, [walletAddress])

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User"
    
    // Try to get name from different properties
    const name = user.name || 
                 user.displayName || 
                 user.firstName || 
                 user.email?.split('@')[0] ||
                 "User"
    
    // Add title based on email domain or other indicators
    const email = user.email || ""
    if (email.includes('doctor') || email.includes('dr.')) {
      return `Dr. ${name}`
    } else if (email.includes('nurse')) {
      return `Nurse ${name}`
    } else {
      // For now, let's assume medical professionals
      return `Dr. ${name}`
    }
  }

  const displayName = getUserDisplayName()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
            <p className="text-blue-100">Manage your medical records securely and share them with healthcare providers.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-blue-200">Wallet Status</div>
              <div className="font-semibold">
                {walletAddress ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                ) : (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Not Connected
                  </div>
                )}
              </div>
            </div>
            <User className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Wallet Connection Alert */}
      {showWalletAlert && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Your wallet is not connected. Connect your wallet to access all features.</span>
              <Button 
                size="sm" 
                onClick={() => setShowWalletAlert(false)}
                className="ml-4"
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <StatsCards walletAddress={walletAddress} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Record</CardTitle>
              <CardDescription>Add a new medical document to your secure locker</CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm walletAddress={walletAddress} />
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Medical Records</CardTitle>
              <CardDescription>
                {walletAddress ? 
                  "Your documents are securely stored and linked to your wallet." :
                  "Your documents are securely stored and ready for management."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList walletAddress={walletAddress} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="font-semibold">Generate Health Summary</span>
              <span className="text-sm text-gray-500">Create a comprehensive report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="font-semibold">Share with New Provider</span>
              <span className="text-sm text-gray-500">Grant access to healthcare provider</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="font-semibold">Bulk Upload Records</span>
              <span className="text-sm text-gray-500">Upload multiple files at once</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
