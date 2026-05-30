import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { 
  successResponse, 
  validationErrorResponse,
  handleApiError 
} from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    let sql = `
      SELECT 
        h.id,
        h.type,
        h.date,
        h.time,
        h.courtroom,
        h.status,
        h.judge,
        h.case_id,
        c.title as case_title
      FROM hearings h
      LEFT JOIN cases c ON h.case_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    // Add search filter
    if (search) {
      sql += ` AND (
        h.type LIKE ? OR 
        h.judge LIKE ? OR 
        c.title LIKE ? OR
        h.status LIKE ?
      )`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam, searchParam)
    }

    // Add status filter
    if (status && status !== 'all') {
      sql += ` AND h.status = ?`
      params.push(status)
    }

    sql += ` ORDER BY h.date ASC, h.time ASC`

    const hearings = await query(sql, params)

    // Format the response
    const formattedHearings = hearings.map((hearing: any) => ({
      id: hearing.id,
      type: hearing.type,
      date: hearing.date,
      time: hearing.time,
      courtroom: hearing.courtroom,
      status: hearing.status,
      judge: hearing.judge,
      case_id: hearing.case_id,
      case_title: hearing.case_title
    }))

    return successResponse(formattedHearings, 'Hearings retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch hearings')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, date, time, courtroom, judge, case_id, status } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!type || type.trim().length === 0) {
      errors.type = ['Type is required']
    }
    
    if (!date) {
      errors.date = ['Date is required']
    } else {
      const hearingDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (hearingDate < today) {
        errors.date = ['Date cannot be in the past']
      }
    }
    
    if (!time) {
      errors.time = ['Time is required']
    }
    
    if (!courtroom || courtroom.trim().length === 0) {
      errors.courtroom = ['Courtroom is required']
    }
    
    if (!judge || judge.trim().length === 0) {
      errors.judge = ['Judge is required']
    }
    
    if (!case_id || case_id.trim().length === 0) {
      errors.case_id = ['Case ID is required']
    }

    if (status && !['Scheduled', 'In Progress', 'Completed', 'Postponed'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Check if case exists
    const existingCase = await query('SELECT id FROM cases WHERE id = ?', [case_id])
    if (existingCase.length === 0) {
      return validationErrorResponse({ case_id: ['Case not found'] })
    }

    // Generate hearing ID
    const maxHearingResult = await query(
      "SELECT MAX(CAST(SUBSTRING(id, 4) AS UNSIGNED)) as maxHearing FROM hearings WHERE id LIKE 'HRG%'"
    )
    const maxHearingNum = (maxHearingResult[0]?.maxHearing || 0)
    const hearingId = `HRG${String(maxHearingNum + 1).padStart(4, '0')}`

    const sql = `
      INSERT INTO hearings (id, type, date, time, courtroom, judge, case_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    await query(sql, [
      hearingId, 
      type.trim(), 
      date, 
      time, 
      courtroom.trim(), 
      judge.trim(), 
      case_id.trim(), 
      status || 'Scheduled'
    ])

    // Return the created hearing
    const createdHearingResult = await query(
      'SELECT * FROM hearings WHERE id = ?',
      [hearingId]
    )
    const createdHearing = createdHearingResult.length > 0 ? createdHearingResult[0] : null

    return successResponse(
      createdHearing, 
      'Hearing scheduled successfully', 
      201
    )
  } catch (error) {
    return handleApiError(error, 'Failed to schedule hearing')
  }
}
