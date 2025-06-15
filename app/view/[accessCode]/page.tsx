'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar, Shield } from "lucide-react"

interface SharedDocument {
  id: string
  file_name: string
  ipfs_cid: string
  created_at: string
}

export default function ViewSharedDocument() {
  const params = useParams()
  const accessCode = params.accessCode as string
  const [document, setDocument] = useState<SharedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (accessCode) {
      fetchDocument()
    }
  }, [accessCode])

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/view/${accessCode}`)
      const data = await response.json()

      if (data.success) {
        setDocument(data.document)
      } else {
        setError(data.error || 'Failed to load document')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      setError('Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  const viewDocument = () => {
    if (document) {
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${document.ipfs_cid}`
      window.open(ipfsUrl, '_blank')
    }
  }

  const downloadDocument = () => {
    if (document) {
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${document.ipfs_cid}`
      const link = document.createElement('a')
      link.href = ipfsUrl
      link.download = document.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shared document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              This link may have expired or the document may no longer be available.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Document Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">The requested document could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medilocker</h1>
            <p className="text-gray-600">Secure Medical Document Sharing</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-green-600" />
                  Shared Medical Document
                </CardTitle>
                <div className="text-sm text-gray-500">
                  <Calendar className="inline mr-1 h-4 w-4" />
                  {new Date(document.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{document.file_name}</h3>
                  <p className="text-sm text-gray-500">
                    IPFS: {document.ipfs_cid.slice(0, 10)}...
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Secure Document</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  This document is securely stored on IPFS and shared through Medilocker's secure sharing system.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={viewDocument}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Document
                </Button>
                <Button
                  onClick={downloadDocument}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>This document was shared securely through Medilocker</p>
                <p>Your privacy and data security are our top priorities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 