"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ImageIcon,
  File,
  Share2,
  Download,
  Eye,
  Calendar,
  HardDrive,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Document {
  id: string
  user_wallet_address: string
  file_name: string
  ipfs_cid: string
  created_at: string
  file_size?: number
  is_shared?: boolean
}

interface DocumentListProps {
  walletAddress?: string | null
}

export function DocumentList({ walletAddress }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      fetchDocuments()
    } else {
      // Sample documents for demonstration
      setDocuments([
        {
          id: "1",
          user_wallet_address: "sample",
          file_name: "Blood Test Results - March 2024.pdf",
          ipfs_cid: "QmX7Vz8K9...",
          created_at: "2024-03-15T10:30:00Z",
          file_size: 2.4 * 1024 * 1024, // 2.4 MB
          is_shared: false
        },
        {
          id: "2",
          user_wallet_address: "sample",
          file_name: "MRI Scan - Brain.dcm",
          ipfs_cid: "QmY8Wx9L0...",
          created_at: "2024-03-10T14:20:00Z",
          file_size: 45.2 * 1024 * 1024, // 45.2 MB
          is_shared: true
        },
        {
          id: "3",
          user_wallet_address: "sample",
          file_name: "Prescription - Dr. Smith.pdf",
          ipfs_cid: "QmZ9Yx0M1...",
          created_at: "2024-03-08T09:15:00Z",
          file_size: 1.1 * 1024 * 1024, // 1.1 MB
          is_shared: false
        }
      ])
      setLoading(false)
    }
  }, [walletAddress])

  const fetchDocuments = async () => {
    if (!walletAddress) return
    
    try {
      const response = await fetch(`/api/documents?walletAddress=${walletAddress}`)
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "dcm":
        return <File className="h-5 w-5 text-green-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const generateShareLink = async (docId: string) => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: docId,
          expiresInHours: 24
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setShareLink(data.shareUrl)
        setShareDialogOpen(docId)
      } else {
        alert('Failed to generate share link')
      }
    } catch (error) {
      console.error('Failed to generate share link:', error)
      alert('Failed to generate share link')
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const viewDocument = (ipfsCid: string) => {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`
    window.open(ipfsUrl, '_blank')
  }

  if (!walletAddress) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Wallet Not Connected</h3>
          <p className="text-gray-500 mb-4">Connect your wallet to view and manage your medical records.</p>
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              Your wallet address is required to access your medical records. Please connect your wallet through Civic Auth.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your medical records...</p>
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No medical records yet</h3>
          <p className="text-gray-500 mb-4">Upload your first medical record to get started with Medilocker.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                  {getFileIcon(doc.file_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1 truncate">{doc.file_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                    <Badge variant={doc.is_shared ? "default" : "secondary"} className="text-xs">
                      {doc.is_shared ? "Shared" : "Private"}
                    </Badge>
                    {doc.file_size && (
                      <div className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-1" />
                        {(doc.file_size / (1024 * 1024)).toFixed(1)} MB
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span className="font-mono">IPFS: {doc.ipfs_cid}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => viewDocument(doc.ipfs_cid)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-green-50 hover:text-green-600"
                  onClick={() => {
                    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${doc.ipfs_cid}`
                    window.open(ipfsUrl, '_blank')
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Dialog open={shareDialogOpen === doc.id} onOpenChange={(open) => !open && setShareDialogOpen(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-purple-50 hover:text-purple-600"
                      onClick={() => generateShareLink(doc.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Medical Record</DialogTitle>
                      <DialogDescription>
                        Generate a secure, time-limited link to share this document with healthcare providers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="share-link">Secure Share Link</Label>
                        <div className="flex space-x-2">
                          <Input id="share-link" value={shareLink} readOnly className="font-mono text-sm" />
                          <Button onClick={copyToClipboard} size="sm" variant="outline">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This link will expire in 24 hours and can only be accessed by the person you share it with.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShareDialogOpen(null)}
                          className="flex-1"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Share Document
                        </Button>
                        <Button variant="outline" onClick={() => setShareDialogOpen(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
