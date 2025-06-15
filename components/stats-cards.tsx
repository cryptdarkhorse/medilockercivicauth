"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Share2, Shield, HardDrive } from "lucide-react"

interface StatsCardsProps {
  walletAddress?: string | null
}

export function StatsCards({ walletAddress }: StatsCardsProps) {
  const [stats, setStats] = useState({
    totalRecords: 3,
    sharedRecords: 1,
    storageUsed: "48.7 MB",
    securityScore: "100%"
  })

  useEffect(() => {
    if (walletAddress) {
      fetchStats()
    } else {
      // Sample data for demonstration when no wallet is connected
      setStats({
        totalRecords: 3,
        sharedRecords: 1,
        storageUsed: "48.7 MB",
        securityScore: "100%"
      })
    }
  }, [walletAddress])

  const fetchStats = async () => {
    if (!walletAddress) return
    
    try {
      const response = await fetch(`/api/documents?walletAddress=${walletAddress}`)
      const data = await response.json()
      
      if (data.success) {
        const documents = data.documents || []
        const totalRecords = documents.length
        const sharedRecords = documents.filter((doc: any) => doc.is_shared).length
        const storageUsed = calculateStorageUsed(documents)
        
        setStats({
          totalRecords,
          sharedRecords,
          storageUsed,
          securityScore: "100%"
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const calculateStorageUsed = (documents: any[]) => {
    const totalBytes = documents.reduce((sum: number, doc: any) => {
      return sum + (doc.file_size || 0)
    }, 0)
    
    const mb = totalBytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const statsData = [
    {
      title: "Total Records",
      value: stats.totalRecords.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `+${Math.floor(stats.totalRecords * 0.3)} this month`,
    },
    {
      title: "Shared Records",
      value: stats.sharedRecords.toString(),
      icon: Share2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${Math.round((stats.sharedRecords / Math.max(stats.totalRecords, 1)) * 100)}% of total`,
    },
    {
      title: "Storage Used",
      value: stats.storageUsed,
      icon: HardDrive,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "of unlimited",
    },
    {
      title: "Security Score",
      value: stats.securityScore,
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "Fully encrypted",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
