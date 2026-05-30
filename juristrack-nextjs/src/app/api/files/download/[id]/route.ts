import { NextRequest } from 'next/server'
import { join } from 'path'
import { existsSync } from 'fs'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileId = id

    // Get file info from database
    const fileInfo = await query(
      `SELECT file_path, name, type FROM documents WHERE id = ?`,
      [fileId]
    )

    if (fileInfo.length === 0) {
      return new Response('File not found', { status: 404 })
    }

    const file = fileInfo[0]

    // Handle link files differently
    if (file.type === 'link') {
      return Response.redirect(file.file_path)
    }

    // Handle physical files
    const filePath = join(process.cwd(), file.file_path)
    
    if (!existsSync(filePath)) {
      return new Response('File not found on disk', { status: 404 })
    }

    // Return file for download
    const fileBuffer = require('fs').readFileSync(filePath)
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name}"`
      }
    })
  } catch (error) {
    return new Response('Failed to download file', { status: 500 })
  }
}
