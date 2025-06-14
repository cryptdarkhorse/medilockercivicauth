"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Share2, Shield, HardDrive } from "lucide-react"
import type { Document } from "./dashboard"

interface StatsCardsProps {
  documents: Document[]
}

export function StatsCards({ documents }: StatsCardsProps) {
  const totalDocuments = documents.length
  const sharedDocuments = documents.filter((doc) => doc.shared).length
  const totalSize = documents.reduce((acc, doc) => {
    const size = Number.parseFloat(doc.size.replace(" MB", ""))
    return acc + size
  }, 0)

  const stats = [
    {
      title: "Total Records",
      value: totalDocuments.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 this month",
    },
    {
      title: "Shared Records",
      value: sharedDocuments.toString(),
      icon: Share2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${Math.round((sharedDocuments / totalDocuments) * 100) || 0}% of total`,
    },
    {
      title: "Storage Used",
      value: `${totalSize.toFixed(1)} MB`,
      icon: HardDrive,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "of unlimited",
    },
    {
      title: "Security Score",
      value: "100%",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "Fully encrypted",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
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
