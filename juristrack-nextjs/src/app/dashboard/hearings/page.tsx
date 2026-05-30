'use client'

import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { HearingForm } from '@/components/forms/HearingForm'
import { Calendar, Plus, Search, Filter, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react'

interface Hearing {
  id: string
  type: string
  date: string
  time: string
  courtroom: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed'
  judge: string
  case_id: string
  case_title?: string
}

export default function Hearings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHearings()
  }, [searchTerm, filterStatus])

  const fetchHearings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus
      })
      
      const response = await fetch(`/api/hearings?${params}`)
      if (!response.ok) throw new Error('Failed to fetch hearings')
      const result = await response.json()
      setHearings(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hearings')
    } finally {
      setLoading(false)
    }
  }

  const handleEditHearing = (hearing: Hearing) => {
    setEditingHearing(hearing)
    setIsModalOpen(true)
  }

  const handleDeleteHearing = async (hearingId: string) => {
    if (!confirm('Are you sure you want to delete this hearing?')) return
    
    try {
      const response = await fetch(`/api/hearings/${hearingId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete hearing')
      }
      
      fetchHearings() // Refresh the hearings list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete hearing')
    }
  }

  const hearingColumns = [
    { key: 'date', label: 'Date', width: '120px', align: 'center' as const },
    { key: 'time', label: 'Time', width: '100px', align: 'center' as const },
    { key: 'case_title', label: 'Case', width: '200px' },
    { key: 'type', label: 'Type', width: '150px' },
    { key: 'courtroom', label: 'Courtroom', width: '120px', align: 'center' as const },
    { key: 'judge', label: 'Judge', width: '200px' },
    { key: 'status', label: 'Status', width: '120px', align: 'center' as const },
    { key: 'actions', label: 'Actions', width: '80px', align: 'center' as const }
  ]

  const statusColors = {
    'Scheduled': 'text-blue-600 bg-blue-100',
    'In Progress': 'text-yellow-600 bg-yellow-100',
    'Completed': 'text-green-600 bg-green-100',
    'Postponed': 'text-red-600 bg-red-100'
  }

  const enhancedHearingColumns = hearingColumns.map(col => ({
    ...col,
    render: col.key === 'status' ? (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
        {value}
      </span>
    ) : col.key === 'date' ? (value: string) => (
      <span className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString() : 'Not set'}
      </span>
    ) : col.key === 'actions' ? (value: any, row: Hearing) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleEditHearing(row)
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit hearing"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteHearing(row.id)
          }}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete hearing"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hearings</h1>
          <p className="text-gray-600">Manage court hearings and schedules</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Hearing</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Hearings</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{hearings.length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {hearings.filter(h => {
              const hearingDate = new Date(h.date).toDateString()
              const today = new Date().toDateString()
              return hearingDate === today
            }).length}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Week</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {hearings.filter(h => {
              const hearingDate = new Date(h.date)
              const today = new Date()
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
              return hearingDate >= weekAgo && hearingDate <= today
            }).length}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Scheduled</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {hearings.filter(h => h.status === 'Scheduled').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hearings..."
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
              <option value="scheduled">Scheduled</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hearings Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchHearings} className="btn-primary">Retry</button>
        </div>
      ) : (
        <Table
          columns={enhancedHearingColumns}
          data={hearings}
          onRowClick={(row) => console.log('Navigate to hearing details:', row.id)}
        />
      )}

      {/* Hearing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingHearing(null)
        }}
        title={editingHearing ? 'Edit Hearing' : 'Schedule New Hearing'}
        size="lg"
      >
        <HearingForm
          initialData={editingHearing ? {
            id: editingHearing.id,
            type: editingHearing.type,
            date: editingHearing.date,
            time: editingHearing.time,
            courtroom: editingHearing.courtroom,
            status: editingHearing.status,
            judge: editingHearing.judge,
            case_id: editingHearing.case_id
          } : undefined}
          onSubmit={async (formData) => {
            try {
              if (editingHearing) {
                // Update existing hearing
                const response = await fetch(`/api/hearings/${editingHearing.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to update hearing')
                }
              } else {
                // Create new hearing
                const response = await fetch('/api/hearings', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to schedule hearing')
                }
              }
              
              setIsModalOpen(false)
              setEditingHearing(null)
              fetchHearings() // Refresh the hearings list
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            }
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingHearing(null)
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
