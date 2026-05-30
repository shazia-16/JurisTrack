import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { 
  successResponse, 
  notFoundResponse,
  validationErrorResponse,
  handleApiError 
} from '@/lib/api-response'

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const caseResult = await query(`
      SELECT 
        id,
        title,
        status,
        court,
        next_hearing_date,
        created_at,
        updated_at
      FROM cases
      WHERE id = ?
    `, [id])

    if (caseResult.length === 0) {
      return notFoundResponse('Case')
    }

    return successResponse(caseResult[0], 'Case retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch case details')
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if case exists
    const existingCase = await query('SELECT id FROM cases WHERE id = ?', [id])
    if (existingCase.length === 0) {
      return notFoundResponse('Case')
    }

    const sql = `
      UPDATE cases 
      SET title = ?, status = ?, court = ?, next_hearing_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    await query(sql, [
      title.trim(), 
      status || 'Active', 
      court || null, 
      next_hearing_date || null, 
      id
    ])

    // Return updated case
    const updatedCase = await query(
      'SELECT * FROM cases WHERE id = ?',
      [id]
    )

    return successResponse(
      updatedCase[0], 
      'Case updated successfully'
    )
  } catch (error) {
    return handleApiError(error, 'Failed to update case')
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if case exists
    const existingCase = await query('SELECT id FROM cases WHERE id = ?', [id])
    if (existingCase.length === 0) {
      return notFoundResponse('Case')
    }

    await query('DELETE FROM cases WHERE id = ?', [id])

    return successResponse(null, 'Case deleted successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to delete case')
  }
}
