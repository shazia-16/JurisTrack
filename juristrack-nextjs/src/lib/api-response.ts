import { NextResponse } from 'next/server'

// Success response helper
export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    message: message || 'Operation successful'
  }, { status })
}

// Error response helper
export function errorResponse(message: string, status = 500, details?: any) {
  console.error('API Error:', message, details)
  
  return NextResponse.json({
    success: false,
    error: message,
    ...(details && { details })
  }, { status })
}

// Validation error response
export function validationErrorResponse(errors: Record<string, string[]>) {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    errors
  }, { status: 400 })
}

// Not found response
export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json({
    success: false,
    error: `${resource} not found`
  }, { status: 404 })
}

// Unauthorized response
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 401 })
}

// Method not allowed response
export function methodNotAllowedResponse(allowedMethods: string[]) {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    allowedMethods
  }, { status: 405 })
}

// Handle async route errors
export function handleApiError(error: any, defaultMessage = 'Internal server error') {
  if (error.code === 'ER_DUP_ENTRY') {
    return errorResponse('Duplicate entry', 409, error.message)
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse('Referenced record not found', 400, error.message)
  }
  
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return errorResponse('Cannot delete: record is referenced by other records', 400, error.message)
  }
  
  return errorResponse(defaultMessage, 500, error.message)
}
