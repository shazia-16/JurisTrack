'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface ClientFormData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: 'Individual' | 'Corporate' | 'Government'
  status: 'Active' | 'Inactive'
}

interface ClientFormProps {
  initialData?: Partial<ClientFormData>
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const typeOptions = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Government', label: 'Government' }
]

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
]

export function ClientForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'Individual',
    status: 'Active'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ClientFormData, boolean>>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }))
    }
  }, [initialData])

  const validateField = (name: keyof ClientFormData, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Client name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters long'
        if (value.trim().length > 255) return 'Name must be less than 255 characters'
        break
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
        break
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) return 'Invalid phone format'
        break
      case 'type':
        if (!value) return 'Client type is required'
        break
      case 'status':
        if (!value) return 'Status is required'
        break
      case 'address':
        if (value && value.trim().length > 500) return 'Address must be less than 500 characters'
        break
    }
    return ''
  }

  const handleInputChange = (name: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof ClientFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ClientFormData
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

  const getFieldError = (fieldName: keyof ClientFormData) => {
    return touched[fieldName] ? errors[fieldName] : ''
  }

  const hasFieldError = (fieldName: keyof ClientFormData) => {
    return touched[fieldName] && !!errors[fieldName]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client ID (only for editing) */}
      {initialData?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client ID
          </label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      )}

      {/* Client Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Client Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('name')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Enter client name"
          disabled={isLoading}
        />
        {hasFieldError('name') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
        )}
      </div>

      {/* Client Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Client Type *
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
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasFieldError('type') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('type')}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('email')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Enter email address"
          disabled={isLoading}
        />
        {hasFieldError('email') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            hasFieldError('phone')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Enter phone number"
          disabled={isLoading}
        />
        {hasFieldError('phone') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            hasFieldError('address')
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Enter address"
          rows={3}
          disabled={isLoading}
        />
        {hasFieldError('address') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
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
          {initialData?.id ? 'Update Client' : 'Add Client'}
        </Button>
      </div>
    </form>
  )
}
