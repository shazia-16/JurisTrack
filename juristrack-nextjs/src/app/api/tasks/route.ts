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
        title,
        description,
        assigned_to,
        priority,
        status,
        due_date,
        created_at,
        updated_at
      FROM tasks
    `

    const params = []
    
    if (search) {
      sql += ` WHERE title LIKE ? OR description LIKE ? OR assigned_to LIKE ?`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY created_at DESC`

    const tasks = await query(sql, params)

    return successResponse(tasks, 'Tasks retrieved successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to fetch tasks')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, assigned_to, priority, status, due_date } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!title || title.trim().length === 0) {
      errors.title = ['Title is required']
    } else if (title.trim().length < 3) {
      errors.title = ['Title must be at least 3 characters long']
    } else if (title.trim().length > 255) {
      errors.title = ['Title must be less than 255 characters']
    }

    if (!description || description.trim().length === 0) {
      errors.description = ['Description is required']
    }

    if (!assigned_to || assigned_to.trim().length === 0) {
      errors.assigned_to = ['Assigned to is required']
    }

    if (!priority || !['Low', 'Medium', 'High'].includes(priority)) {
      errors.priority = ['Invalid priority value']
    }

    if (!status || !['Pending', 'In Progress', 'Completed', 'Overdue'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (!due_date) {
      errors.due_date = ['Due date is required']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Generate unique ID
    const taskId = `TSK${Date.now().toString().slice(-6)}`

    // Insert new task
    await query(
      `INSERT INTO tasks (id, title, description, assigned_to, priority, status, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [taskId, title, description, assigned_to, priority, status, due_date, new Date(), new Date()]
    )

    const newTask = {
      id: taskId,
      title,
      description,
      assigned_to,
      priority,
      status,
      due_date,
      created_at: new Date(),
      updated_at: new Date()
    }

    return successResponse(newTask, 'Task created successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to create task')
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, assigned_to, priority, status, due_date } = body

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!title || title.trim().length === 0) {
      errors.title = ['Title is required']
    } else if (title.trim().length < 3) {
      errors.title = ['Title must be at least 3 characters long']
    } else if (title.trim().length > 255) {
      errors.title = ['Title must be less than 255 characters']
    }

    if (!description || description.trim().length === 0) {
      errors.description = ['Description is required']
    }

    if (!assigned_to || assigned_to.trim().length === 0) {
      errors.assigned_to = ['Assigned to is required']
    }

    if (!priority || !['Low', 'Medium', 'High'].includes(priority)) {
      errors.priority = ['Invalid priority value']
    }

    if (!status || !['Pending', 'In Progress', 'Completed', 'Overdue'].includes(status)) {
      errors.status = ['Invalid status value']
    }

    if (!due_date) {
      errors.due_date = ['Due date is required']
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Update task
    await query(
      `UPDATE tasks SET title = ?, description = ?, assigned_to = ?, priority = ?, status = ?, due_date = ?, updated_at = ? WHERE id = ?`,
      [title, description, assigned_to, priority, status, due_date, new Date(), id]
    )

    const updatedTask = {
      id,
      title,
      description,
      assigned_to,
      priority,
      status,
      due_date,
      updated_at: new Date()
    }

    return successResponse(updatedTask, 'Task updated successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to update task')
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if task exists
    const existingTask = await query('SELECT id FROM tasks WHERE id = ?', [id])
    if (existingTask.length === 0) {
      return notFoundResponse('Task')
    }

    // Delete task
    await query('DELETE FROM tasks WHERE id = ?', [id])

    return successResponse(null, 'Task deleted successfully')
  } catch (error) {
    return handleApiError(error, 'Failed to delete task')
  }
}
