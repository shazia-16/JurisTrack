'use client'

import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { CaseForm } from '@/components/forms/CaseForm'
import { FileText, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'

interface Case {
  id: string
  title: string
  status: 'Active' | 'Pending' | 'Closed'
  court: string
  next_hearing_date: string | null
  created_at: string
}

export default function Cases() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCases()
  }, [searchTerm, filterStatus])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus
      })
      
      const response = await fetch(`/api/cases?${params}`)
      if (!response.ok) throw new Error('Failed to fetch cases')
      const result = await response.json()
      setCases(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases')
    } finally {
      setLoading(false)
    }
  }

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem)
    setIsModalOpen(true)
  }

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return
    
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete case')
      }
      
      fetchCases() // Refresh the cases list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete case')
    }
  }

  const caseColumns = [
    { key: 'id', label: 'Case ID', width: '120px' },
    { key: 'title', label: 'Title', width: '2fr' },
    { key: 'status', label: 'Status', width: '100px', align: 'center' as const },
    { key: 'court', label: 'Court', width: '150px' },
    { key: 'next_hearing_date', label: 'Next Hearing', width: '120px', align: 'center' as const },
    { key: 'created_at', label: 'Created', width: '120px', align: 'center' as const },
    { key: 'actions', label: 'Actions', width: '80px', align: 'center' as const }
  ]

  const statusColors = {
    'Active': 'text-green-600 bg-green-100',
    'Pending': 'text-yellow-600 bg-yellow-100',
    'Closed': 'text-gray-600 bg-gray-100'
  }

  const enhancedCaseColumns = caseColumns.map(col => ({
    ...col,
    render: col.key === 'status' ? (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
        {value}
      </span>
    ) : col.key === 'next_hearing_date' ? (value: string) => (
      <span className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString() : 'Not scheduled'}
      </span>
    ) : col.key === 'created_at' ? (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString()}
      </span>
    ) : col.key === 'actions' ? (value: any, row: Case) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleEditCase(row)
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit case"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteCase(row.id)
          }}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete case"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ) : undefined
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cases</h1>
          <p className="text-gray-600">Manage and track all legal cases</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Case</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, title, status, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchCases} className="btn-primary">Retry</button>
        </div>
      ) : (
        <Table
          columns={enhancedCaseColumns}
          data={cases}
          onRowClick={(row) => console.log('Navigate to case details:', row.id)}
        />
      )}

      {/* Case Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCase(null)
        }}
        title={editingCase ? 'Edit Case' : 'Create New Case'}
        size="lg"
      >
        <CaseForm
          initialData={editingCase ? {
            id: editingCase.id,
            title: editingCase.title,
            status: editingCase.status,
            court: editingCase.court,
            next_hearing_date: editingCase.next_hearing_date || ''
          } : undefined}
          onSubmit={async (formData) => {
            try {
              if (editingCase) {
                // Update existing case
                const response = await fetch(`/api/cases/${editingCase.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to update case')
                }
              } else {
                // Create new case
                const response = await fetch('/api/cases', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to create case')
                }
              }
              
              setIsModalOpen(false)
              setEditingCase(null)
              fetchCases() // Refresh the cases list
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            }
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingCase(null)
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
