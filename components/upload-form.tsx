"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import type { Document } from "./dashboard"

interface UploadFormProps {
  onUploadSuccess: (doc: Document) => void
  onCancel: () => void
}

export function UploadForm({ onUploadSuccess, onCancel }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else if (extension === "pdf") {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newDoc: Document = {
      id: Date.now().toString(),
      fileName: file.name,
      fileType: file.name.split(".").pop()?.toUpperCase() || "FILE",
      uploadDate: new Date().toISOString().split("T")[0],
      ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}...`,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      shared: false,
    }

    onUploadSuccess(newDoc)
    setIsUploading(false)
  }

  return (
    <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-blue-600" />
              Upload Medical Record
            </CardTitle>
            <CardDescription>Add a new medical document to your secure locker</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-4">
                {getFileIcon(file.name)}
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drop your file here, or{" "}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">Supports PDF, Images, DICOM, and Document files</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for this medical record..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={!file || isUploading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
