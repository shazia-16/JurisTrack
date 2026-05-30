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
    const type = searchParams.get('type') || ''

    let sql = `
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        type,
        status,
        created_at,
        updated_at
      FROM clients
      WHERE 1=1
    `
    const params: any[] = []

    // Add search filter
    if (search) {
      sql += ` AND (
        name LIKE ? OR 
        email LIKE ? OR 
        phone LIKE ?
      )`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
    }

    // Add type filter
    if (type && type !== 'all') {
      sql += ` AND type = ?`
      params.push(type)
    }

    sql += ` ORDER BY name ASC`

    const clients = await query(sql, params)

    return successResponse(clients, 'Clients retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch clients')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, type } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!name || name.trim().length === 0) {
      errors.name = ['Name is required']
    } else if (name.trim().length < 2) {
      errors.name = ['Name must be at least 2 characters long']
    } else if (name.trim().length > 255) {
      errors.name = ['Name must be less than 255 characters']
    }
    
    if (!email || email.trim().length === 0) {
      errors.email = ['Email is required']
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ['Invalid email format']
    }
    
    if (!type) {
      errors.type = ['Type is required']
    } else if (!['Individual', 'Corporate', 'Government'].includes(type)) {
      errors.type = ['Invalid type value']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Generate client ID
    const maxClientResult = await query(
      "SELECT MAX(CAST(SUBSTRING(id, 4) AS UNSIGNED)) as maxClient FROM clients WHERE id LIKE 'CLI%'"
    )
    const maxClientNum = (maxClientResult[0]?.maxClient || 0)
    const clientId = `CLI${String(maxClientNum + 1).padStart(6, '0')}`

    const sql = `
      INSERT INTO clients (id, name, email, phone, address, type, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Active')
    `

    await query(sql, [
      clientId, 
      name.trim(), 
      email.trim().toLowerCase(), 
      phone || null, 
      address || null, 
      type
    ])

    // Return the created client
    const createdClient = await query(
      'SELECT * FROM clients WHERE id = ?',
      [clientId]
    )

    return successResponse(
      createdClient[0], 
      'Client created successfully', 
      201
    )
  } catch (error) {
    return handleApiError(error, 'Failed to create client')
  }
}
