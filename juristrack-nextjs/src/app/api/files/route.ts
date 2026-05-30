import { NextRequest } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { query } from '@/lib/db'
import { 
  successResponse, 
  errorResponse,
  validationErrorResponse,
  handleApiError 
} from '@/lib/api-response'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const links = formData.getAll('links') as string[]
    const entityType = formData.get('entityType') as string
    const entityId = formData.get('entityId') as string

    if (!files?.length && !links?.length) {
      return errorResponse('No files or links provided', 400)
    }

    if (!entityType || !entityId) {
      return errorResponse('Entity type and ID are required', 400)
    }

    const uploadedFiles = []

    // Handle file uploads
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Generate unique filename
      const timestamp = Date.now()
      const originalName = file.name
      const fileExtension = originalName.split('.').pop()
      const fileName = `${timestamp}_${originalName}`
      const filePath = join(UPLOAD_DIR, fileName)

      // Write file to disk
      writeFileSync(filePath, buffer)

      // Save file metadata to database
      const fileRecord = {
        name: originalName,
        original_name: fileName,
        size: file.size,
        type: file.type,
        entity_type: entityType,
        entity_id: entityId,
        file_path: `/uploads/${fileName}`,
        uploaded_at: new Date()
      }

      await query(
        `INSERT INTO documents (name, original_name, size, type, entity_type, entity_id, file_path, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fileRecord.name, fileRecord.original_name, fileRecord.size, fileRecord.type, fileRecord.entity_type, fileRecord.entity_id, fileRecord.file_path, fileRecord.uploaded_at]
      )

      uploadedFiles.push({
        id: timestamp.toString(),
        name: originalName,
        size: file.size,
        type: file.type,
        url: `/uploads/${fileName}`,
        uploaded_at: fileRecord.uploaded_at
      })
    }

    // Handle link uploads
    for (const link of links) {
      if (link.trim()) {
        const timestamp = Date.now()
        const fileName = link.split('/').pop() || 'unknown'
        
        const linkRecord = {
          name: fileName,
          original_name: fileName,
          size: 0,
          type: 'link',
          entity_type: entityType,
          entity_id: entityId,
          file_path: link,
          uploaded_at: new Date()
        }

        await query(
          `INSERT INTO documents (name, original_name, size, type, entity_type, entity_id, file_path, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [linkRecord.name, linkRecord.original_name, linkRecord.size, linkRecord.type, linkRecord.entity_type, linkRecord.entity_id, linkRecord.file_path, linkRecord.uploaded_at]
        )

        uploadedFiles.push({
          id: timestamp.toString(),
          name: fileName,
          size: 0,
          type: 'link',
          url: link,
          uploaded_at: linkRecord.uploaded_at
        })
      }
    }

    return successResponse(uploadedFiles, 'Files uploaded successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to upload files')
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return errorResponse('Entity type and ID are required', 400)
    }

    const documents = await query(
      `SELECT id, name, original_name, size, type, entity_type, entity_id, file_path, uploaded_at FROM documents WHERE entity_type = ? AND entity_id = ? ORDER BY uploaded_at DESC`,
      [entityType, entityId]
    )

    const formattedDocuments = documents.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      original_name: doc.original_name,
      size: doc.size,
      type: doc.type,
      entity_type: doc.entity_type,
      entity_id: doc.entity_id,
      file_path: doc.file_path,
      url: doc.type === 'link' ? doc.file_path : `/api/files/download/${doc.id}`,
      uploaded_at: doc.uploaded_at
    }))

    return successResponse(formattedDocuments, 'Files retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to retrieve files')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return errorResponse('File ID is required', 400)
    }

    // Get file info before deletion
    const fileInfo = await query(
      `SELECT file_path FROM documents WHERE id = ?`,
      [fileId]
    )

    if (fileInfo.length === 0) {
      return errorResponse('File not found', 404)
    }

    // Delete file from database
    await query(
      `DELETE FROM documents WHERE id = ?`,
      [fileId]
    )

    // Delete physical file if it's not a link
    if (fileInfo[0].type !== 'link') {
      const filePath = join(process.cwd(), fileInfo[0].file_path)
      try {
        const fs = require('fs')
        if (existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (err) {
        console.error('Failed to delete file:', err)
      }
    }

    return successResponse(null, 'File deleted successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to delete file')
  }
}
