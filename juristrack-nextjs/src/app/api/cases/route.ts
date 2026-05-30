import { NextRequest } from 'next/server'
import { query } from '@/lib/database-connection'
import { 
  successResponse, 
  errorResponse, 
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
        id,
        title,
        status,
        court,
        next_hearing_date,
        created_at,
        updated_at
      FROM cases
      WHERE 1=1
    `
    const params: any[] = []

    // Add search filter
    if (search) {
      sql += ` AND (
        id LIKE ? OR 
        title LIKE ? OR 
        status LIKE ? OR 
        court LIKE ?
      )`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam, searchParam)
    }

    // Add status filter
    if (status && status !== 'all') {
      sql += ` AND status = ?`
      params.push(status)
    }

    sql += ` ORDER BY created_at DESC`

    const cases = await query(sql, params)

    return successResponse(cases, 'Cases retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch cases')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, status, court, next_hearing_date } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!title || title.trim().length === 0) {
      errors.title = ['Title is required']
    } else if (title.trim().length < 3) {
      errors.title = ['Title must be at least 3 characters long']
    } else if (title.trim().length > 255) {
      errors.title = ['Title must be less than 255 characters']
    }

    if (status && !['Active', 'Pending', 'Closed'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Generate case ID
    const maxCaseResult = await query(
      "SELECT MAX(CAST(SUBSTRING(id, 5) AS UNSIGNED)) as maxCase FROM cases WHERE id LIKE 'CASE%'"
    )
    const maxCaseNum = (maxCaseResult[0]?.maxCase || 0)
    const caseId = `CASE${String(maxCaseNum + 1).padStart(4, '0')}`

    const sql = `
      INSERT INTO cases (id, title, status, court, next_hearing_date)
      VALUES (?, ?, ?, ?, ?)
    `

    await query(sql, [
      caseId, 
      title.trim(), 
      status || 'Active', 
      court || null, 
      next_hearing_date || null
    ])

    // Return the created case
    const createdCase = await query(
      'SELECT * FROM cases WHERE id = ?',
      [caseId]
    )

    return successResponse(
      createdCase[0], 
      'Case created successfully', 
      201
    )
  } catch (error) {
    return handleApiError(error, 'Failed to create case')
  }
}
