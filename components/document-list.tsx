"use client"

import { useState } from "react"
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
} from "lucide-react"
import type { Document } from "./dashboard"
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

interface DocumentListProps {
  documents: Document[]
  onShare: (docId: string) => void
}

export function DocumentList({ documents, onShare }: DocumentListProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const generateShareLink = (docId: string) => {
    const link = `https://medilocker.app/shared/${docId}?token=${Math.random().toString(36).substring(2, 15)}`
    setShareLink(link)
    setShareDialogOpen(docId)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1 truncate">{doc.fileName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-1" />
                      {doc.size}
                    </div>
                    <Badge variant={doc.shared ? "default" : "secondary"} className="text-xs">
                      {doc.shared ? "Shared" : "Private"}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span className="font-mono">IPFS: {doc.ipfsHash}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
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
                          <strong>Note:</strong> This link will expire in 24 hours and can only be accessed 3 times for
                          security.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            onShare(doc.id)
                            setShareDialogOpen(null)
                          }}
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
