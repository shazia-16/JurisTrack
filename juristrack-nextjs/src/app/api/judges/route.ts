import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { 
  successResponse, 
  notFoundResponse,
  validationErrorResponse,
  handleApiError 
} from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    let sql = `
      SELECT 
        id,
        name,
        email,
        phone,
        specialization,
        experience,
        status,
        created_at,
        updated_at
      FROM judges
    `

    const params = []
    
    if (search) {
      sql += ` WHERE name LIKE ? OR email LIKE ? OR specialization LIKE ?`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY created_at DESC`

    const judges = await query(sql, params)

    return successResponse(judges, 'Judges retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch judges')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, specialization, experience, status } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!name || name.trim().length === 0) {
      errors.name = ['Name is required']
    } else if (name.trim().length < 3) {
      errors.name = ['Name must be at least 3 characters long']
    } else if (name.trim().length > 255) {
      errors.name = ['Name must be less than 255 characters']
    }

    if (!email || email.trim().length === 0) {
      errors.email = ['Email is required']
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ['Invalid email format']
    }

    if (!phone || phone.trim().length === 0) {
      errors.phone = ['Phone is required']
    }

    if (!specialization) {
      errors.specialization = ['Specialization is required']
    }

    if (!status || !['Active', 'Inactive'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Generate unique ID
    const judgeId = `JDG${Date.now().toString().slice(-6)}`

    // Insert new judge
    await query(
      `INSERT INTO judges (id, name, email, phone, specialization, experience, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [judgeId, name, email, phone, specialization, experience, status, new Date(), new Date()]
    )

    const newJudge = {
      id: judgeId,
      name,
      email,
      phone,
      specialization,
      experience,
      status,
      created_at: new Date(),
      updated_at: new Date()
    }

    return successResponse(newJudge, 'Judge created successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to create judge')
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, specialization, experience, status } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!name || name.trim().length === 0) {
      errors.name = ['Name is required']
    } else if (name.trim().length < 3) {
      errors.name = ['Name must be at least 3 characters long']
    } else if (name.trim().length > 255) {
      errors.name = ['Name must be less than 255 characters']
    }

    if (!email || email.trim().length === 0) {
      errors.email = ['Email is required']
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ['Invalid email format']
    }

    if (!phone || phone.trim().length === 0) {
      errors.phone = ['Phone is required']
    }

    if (!specialization) {
      errors.specialization = ['Specialization is required']
    }

    if (!status || !['Active', 'Inactive'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Update judge
    await query(
      `UPDATE judges SET name = ?, email = ?, phone = ?, specialization = ?, experience = ?, status = ?, updated_at = ? WHERE id = ?`,
      [name, email, phone, specialization, experience, status, new Date(), id]
    )

    const updatedJudge = {
      id,
      name,
      email,
      phone,
      specialization,
      experience,
      status,
      updated_at: new Date()
    }

    return successResponse(updatedJudge, 'Judge updated successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to update judge')
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context
  try {
    const { id } = await params

    // Check if judge exists
    const existingJudge = await query('SELECT id FROM judges WHERE id = ?', [id])
    if (existingJudge.length === 0) {
      return notFoundResponse('Judge')
    }

    // Delete judge
    await query('DELETE FROM judges WHERE id = ?', [id])

    return successResponse(null, 'Judge deleted successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to delete judge')
  }
}
