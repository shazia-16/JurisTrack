import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''

    let sql = `
      SELECT 
        d.id,
        d.title,
        d.type,
        d.format,
        d.size,
        d.uploaded_date as uploadedDate,
        d.uploaded_by as uploadedBy,
        d.case_id,
        c.title as caseTitle
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      WHERE 1=1
    `
    const params = []

    // Add search filter
    if (search) {
      sql += ` AND (
        d.title LIKE ? OR 
        d.type LIKE ? OR 
        d.uploaded_by LIKE ? OR
        c.title LIKE ?
      )`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam, searchParam)
    }

    // Add type filter
    if (type && type !== 'all') {
      sql += ` AND d.type = ?`
      params.push(type)
    }

    sql += ` ORDER BY d.uploaded_date DESC`

    const documents = await query(sql, params)

    // Format the response
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      format: doc.format,
      size: doc.size,
      uploadedDate: doc.uploadedDate,
      uploadedBy: doc.uploadedBy,
      caseId: doc.caseId,
      caseTitle: doc.caseTitle
    }))

    return NextResponse.json(formattedDocuments)
  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, format, size, caseId, uploadedBy } = body

    if (!title || !type || !caseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate document ID
    const documentId = `DOC${Date.now().toString().slice(-6)}`

    const sql = `
      INSERT INTO documents (id, title, type, format, size, case_id, uploaded_by, uploaded_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    `

    await query(sql, [documentId, title, type, format || null, size || null, caseId, uploadedBy])

    return NextResponse.json({ 
      message: 'Document uploaded successfully',
      documentId 
    }, { status: 201 })
  } catch (error) {
    console.error('Upload document API error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
