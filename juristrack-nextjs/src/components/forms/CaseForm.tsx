'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface CaseFormData {
  id: string
  title: string
  status: 'Active' | 'Pending' | 'Closed'
  court: string
  next_hearing_date: string
}

interface CaseFormProps {
  initialData?: Partial<CaseFormData>
  onSubmit: (data: CaseFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Closed', label: 'Closed' }
]

const courtOptions = [
  'Superior Court',
  'District Court',
  'Family Court',
  'Criminal Court',
  'Federal Court',
  'Municipal Court',
  'Circuit Court'
]

export function CaseForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    id: '',
    title: '',
    status: 'Active',
    court: '',
    next_hearing_date: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof CaseFormData, boolean>>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }))
    }
  }, [initialData])

  const validateField = (name: keyof CaseFormData, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Case title is required'
        if (value.trim().length < 3) return 'Title must be at least 3 characters'
        if (value.trim().length > 255) return 'Title must be less than 255 characters'
        break
      case 'court':
        if (!value.trim()) return 'Court is required'
        break
      case 'status':
        if (!value) return 'Status is required'
        break
      case 'next_hearing_date':
        if (value) {
          const date = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (date < today) return 'Hearing date cannot be in the past'
        }
        break
    }
    return ''
  }

  const handleInputChange = (name: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof CaseFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CaseFormData, string>> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof CaseFormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}))

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const getFieldError = (fieldName: keyof CaseFormData) => {
    return touched[fieldName] ? errors[fieldName] : ''
  }

  const hasFieldError = (fieldName: keyof CaseFormData) => {
    return touched[fieldName] && !!errors[fieldName]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Case ID (only for editing) */}
      {initialData?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case ID
          </label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      )}

      {/* Case Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Case Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('title')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Enter case title"
          disabled={isLoading}
        />
        {hasFieldError('title') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          onBlur={() => handleBlur('status')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('status')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasFieldError('status') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('status')}</p>
        )}
      </div>

      {/* Court */}
      <div>
        <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
          Court *
        </label>
        <select
          id="court"
          value={formData.court}
          onChange={(e) => handleInputChange('court', e.target.value)}
          onBlur={() => handleBlur('court')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('court')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select a court</option>
          {courtOptions.map(court => (
            <option key={court} value={court}>
              {court}
            </option>
          ))}
        </select>
        {hasFieldError('court') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('court')}</p>
        )}
      </div>

      {/* Next Hearing Date */}
      <div>
        <label htmlFor="next_hearing_date" className="block text-sm font-medium text-gray-700 mb-2">
          Next Hearing Date
        </label>
        <input
          type="date"
          id="next_hearing_date"
          value={formData.next_hearing_date}
          onChange={(e) => handleInputChange('next_hearing_date', e.target.value)}
          onBlur={() => handleBlur('next_hearing_date')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('next_hearing_date')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
          min={new Date().toISOString().split('T')[0]}
        />
        {hasFieldError('next_hearing_date') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('next_hearing_date')}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {initialData?.id ? 'Update Case' : 'Create Case'}
        </Button>
      </div>
    </form>
  )
}
