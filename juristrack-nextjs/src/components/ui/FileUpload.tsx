'use client'

import { useState, useRef } from 'react'
import { Upload, Link, File, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploaded_at: string
}

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void
  onFileUpload?: (files: UploadedFile[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  className?: string
}

export default function FileUpload({
  onFileSelect,
  onFileUpload,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = ''
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<string[]>([])
  const [validFiles, setValidFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const selectedFiles = Array.from(files)
    const validFilesList: File[] = []
    const newErrors: string[] = []

    selectedFiles.forEach(file => {
      if (file.size > maxSize) {
        newErrors.push(`File "${file.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`)
      } else {
        validFilesList.push(file)
      }
    })

    setErrors(newErrors)
    setValidFiles(validFilesList)
    
    if (validFilesList.length > 0) {
      onFileSelect?.(validFilesList)
      // Automatically upload files when selected
      handleFileAdd(validFilesList)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileAdd = async (files: File[] | string[]) => {
    try {
      const formData = new FormData()
      
      // Add files to FormData
      files.forEach((file: File | string) => {
        if (file instanceof File) {
          formData.append('files', file)
        } else {
          // Handle links
          formData.append('links', file)
        }
      })

      // Add entity type and ID
      formData.append('entityType', 'hearing') // Default entity type
      formData.append('entityId', 'temp') // Default entity ID

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Upload failed')
      }

      const result = await response.json()
      const uploadedFiles = result.data || []
      
      // Update uploaded files state
      setUploadedFiles(prev => [...prev, ...uploadedFiles])
      onFileUpload?.(uploadedFiles)
      
      // Clear selected files after successful upload
      setValidFiles([])
      setErrors([])
      
    } catch (err) {
      console.error('Upload error:', err)
      setErrors([err instanceof Error ? err.message : 'Upload failed'])
    }
  }

  const handleLinkAdd = (url: string) => {
    if (url.trim()) {
      handleFileAdd([url])
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const m = k * 1024
    const g = m * 1024
    
    if (bytes < k) return bytes + ' Bytes'
    if (bytes < m) return (bytes / k).toFixed(2) + ' KB'
    if (bytes < g) return (bytes / m).toFixed(2) + ' MB'
    return (bytes / g).toFixed(2) + ' GB'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop files here or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              {multiple ? 'Select files' : 'Select a file'} (Max: {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        </div>
      </div>

      
      {/* Link Input */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Link className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            placeholder="Or paste a file link..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                if (target.value.trim()) {
                  handleLinkAdd(target.value.trim())
                  target.value = ''
                }
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[type="url"]') as HTMLInputElement
              if (input?.value.trim()) {
                handleLinkAdd(input.value.trim())
                input.value = ''
              }
            }}
            disabled={false}
          >
            Add Link
          </Button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.type === 'link' ? 'External Link' : formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {file.url && (
                  <a
                    href={file.url}
                    target={file.type === 'link' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    download={file.type !== 'link' ? file.name : undefined}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    {file.type === 'link' ? 'Open' : 'Download'}
                  </a>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Indicators */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { FileUpload }
