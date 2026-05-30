'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '../ui/FileUpload'

interface HearingFormData {
  id: string
  type: string
  date: string
  time: string
  courtroom: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed'
  judge: string
  case_id: string
}

interface HearingFormProps {
  initialData?: Partial<HearingFormData>
  onSubmit: (data: HearingFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Postponed', label: 'Postponed' }
]

const hearingTypes = [
  'Initial Hearing',
  'Status Conference',
  'Pre-trial Motion',
  'Arraignment',
  'Trial',
  'Final Hearing',
  'Motion Hearing',
  'Discovery Hearing'
]

const courtrooms = [
  'Courtroom 101',
  'Courtroom 102',
  'Courtroom 103',
  'Courtroom 104',
  'Courtroom 105',
  'Courtroom A',
  'Courtroom B',
  'Courtroom C'
]

const judges = [
  'Judge Robert Johnson',
  'Judge Sarah Williams',
  'Judge Michael Brown',
  'Judge Emily Davis',
  'Judge James Wilson'
]

export function HearingForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: HearingFormProps) {
  const [formData, setFormData] = useState<HearingFormData>({
    id: '',
    type: '',
    date: '',
    time: '',
    courtroom: '',
    status: 'Scheduled',
    judge: '',
    case_id: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof HearingFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof HearingFormData, boolean>>>({})
  const [availableCases, setAvailableCases] = useState([])

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }))
    }
  }, [initialData])

  useEffect(() => {
    // Fetch available cases for the dropdown
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases')
      if (response.ok) {
        const result = await response.json()
        setAvailableCases(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    }
  }

  const validateField = (name: keyof HearingFormData, value: string): string => {
    switch (name) {
      case 'type':
        if (!value.trim()) return 'Hearing type is required'
        break
      case 'date':
        if (!value) return 'Date is required'
        else {
          const date = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (date < today) return 'Hearing date cannot be in the past'
        }
        break
      case 'time':
        if (!value) return 'Time is required'
        break
      case 'courtroom':
        if (!value.trim()) return 'Courtroom is required'
        break
      case 'judge':
        if (!value.trim()) return 'Judge is required'
        break
      case 'case_id':
        if (!value) return 'Case is required'
        break
      case 'status':
        if (!value) return 'Status is required'
        break
    }
    return ''
  }

  const handleInputChange = (name: keyof HearingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof HearingFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HearingFormData, string>> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof HearingFormData
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

  const getFieldError = (fieldName: keyof HearingFormData) => {
    return touched[fieldName] ? errors[fieldName] : ''
  }

  const hasFieldError = (fieldName: keyof HearingFormData) => {
    return touched[fieldName] && !!errors[fieldName]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hearing ID (only for editing) */}
      {initialData?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hearing ID
          </label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      )}

      {/* Case Selection */}
      <div>
        <label htmlFor="case_id" className="block text-sm font-medium text-gray-700 mb-2">
          Case *
        </label>
        <select
          id="case_id"
          value={formData.case_id}
          onChange={(e) => handleInputChange('case_id', e.target.value)}
          onBlur={() => handleBlur('case_id')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('case_id')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select a case</option>
          {availableCases.map((caseItem: any) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.id} - {caseItem.title}
            </option>
          ))}
        </select>
        {hasFieldError('case_id') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('case_id')}</p>
        )}
      </div>

      {/* Hearing Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Hearing Type *
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          onBlur={() => handleBlur('type')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('type')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select hearing type</option>
          {hearingTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {hasFieldError('type') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('type')}</p>
        )}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              hasFieldError('date')
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
          {hasFieldError('date') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('date')}</p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Time *
          </label>
          <input
            type="time"
            id="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            onBlur={() => handleBlur('time')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              hasFieldError('time')
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {hasFieldError('time') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('time')}</p>
          )}
        </div>
      </div>

      {/* Courtroom */}
      <div>
        <label htmlFor="courtroom" className="block text-sm font-medium text-gray-700 mb-2">
          Courtroom *
        </label>
        <select
          id="courtroom"
          value={formData.courtroom}
          onChange={(e) => handleInputChange('courtroom', e.target.value)}
          onBlur={() => handleBlur('courtroom')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('courtroom')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select courtroom</option>
          {courtrooms.map(courtroom => (
            <option key={courtroom} value={courtroom}>
              {courtroom}
            </option>
          ))}
        </select>
        {hasFieldError('courtroom') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('courtroom')}</p>
        )}
      </div>

      {/* Judge */}
      <div>
        <label htmlFor="judge" className="block text-sm font-medium text-gray-700 mb-2">
          Judge *
        </label>
        <select
          id="judge"
          value={formData.judge}
          onChange={(e) => handleInputChange('judge', e.target.value)}
          onBlur={() => handleBlur('judge')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('judge')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select judge</option>
          {judges.map(judge => (
            <option key={judge} value={judge}>
              {judge}
            </option>
          ))}
        </select>
        {hasFieldError('judge') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('judge')}</p>
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

      {/* File Upload Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h4>
        <FileUpload
          onFileUpload={async (files) => {
            try {
              const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  files: files,
                  entityType: 'hearing',
                  entityId: initialData?.id || 'temp'
                }),
              })
              
              if (!response.ok) {
                const errorResult = await response.json()
                throw new Error(errorResult.error || 'Failed to upload files')
              }
              
              // Handle successful file upload
              const result = await response.json()
              console.log('Files uploaded successfully:', result.data)
            } catch (err) {
              console.error('File upload error:', err)
            }
          }}
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          multiple={true}
          maxSize={5 * 1024 * 1024} // 5MB
        />
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
          {initialData?.id ? 'Update Hearing' : 'Schedule Hearing'}
        </Button>
      </div>
    </form>
  )
}
