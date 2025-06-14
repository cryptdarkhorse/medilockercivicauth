"use client"

import { useState } from "react"
import { useCivic } from "@/app/providers/civic-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Share2, FileText, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

export function LoginScreen() {
  const { login, isLoading } = useCivic()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    await login()
    setIsLoggingIn(false)
  }

  const features = [
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your medical records are encrypted and stored securely on IPFS",
    },
    {
      icon: Lock,
      title: "Full Control",
      description: "You own your data with your embedded wallet as the key",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Generate secure, time-limited links to share with healthcare providers",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Take Control of Your Health Data
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Medilocker empowers patients with full ownership of their health records by securing them in a personal
            locker linked to their digital wallet, enabling secure, on-demand sharing with providers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Secure Login with Civic</CardTitle>
                <CardDescription className="text-base">
                  Get started with your embedded wallet in seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  {isLoggingIn ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      Connect with Civic Auth
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-4">No crypto experience needed. Just your email.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 hover:scale-105 cursor-pointer group"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">Powered by IPFS, Supabase, and Civic Auth</span>
          </div>
        </div>
      </div>
    </div>
  )
}
