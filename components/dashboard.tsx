"use client"

import { useState, useEffect } from "react"
import { useCivic } from "@/app/providers/civic-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadForm } from "./upload-form"
import { DocumentList } from "./document-list"
import { StatsCards } from "./stats-cards"
import { FileText, Upload, Share2, Activity } from "lucide-react"

export interface Document {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  ipfsHash: string
  size: string
  shared: boolean
}

export function Dashboard() {
  const { user } = useCivic()
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUpload, setShowUpload] = useState(false)

  // Mock documents for demo
  useEffect(() => {
    const mockDocs: Document[] = [
      {
        id: "1",
        fileName: "Blood Test Results - March 2024.pdf",
        fileType: "PDF",
        uploadDate: "2024-03-15",
        ipfsHash: "QmX7Vz8K9...",
        size: "2.4 MB",
        shared: false,
      },
      {
        id: "2",
        fileName: "MRI Scan - Brain.dcm",
        fileType: "DICOM",
        uploadDate: "2024-03-10",
        ipfsHash: "QmY8Wx9L0...",
        size: "45.2 MB",
        shared: true,
      },
      {
        id: "3",
        fileName: "Prescription - Dr. Smith.pdf",
        fileType: "PDF",
        uploadDate: "2024-03-08",
        ipfsHash: "QmZ9Yx0M1...",
        size: "1.1 MB",
        shared: false,
      },
    ]
    setDocuments(mockDocs)
  }, [])

  const handleUploadSuccess = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev])
    setShowUpload(false)
  }

  const handleShare = (docId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, shared: !doc.shared } : doc)))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-gray-600">Manage your medical records securely and share them with healthcare providers.</p>
      </div>

      <StatsCards documents={documents} />

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Medical Records</h2>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Record
            </Button>
          </div>

          {showUpload && (
            <div className="mb-6">
              <UploadForm onUploadSuccess={handleUploadSuccess} onCancel={() => setShowUpload(false)} />
            </div>
          )}

          <DocumentList documents={documents} onShare={handleShare} />
        </div>

        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Blood test uploaded</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">MRI shared with Dr. Johnson</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Prescription added</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Health Summary
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share with New Provider
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
