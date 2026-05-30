'use client'

import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { ClientForm } from '@/components/forms/ClientForm'
import { Users, Plus, Search, Filter, Mail, Phone, MapPin, Building, User, Edit, Trash2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: 'Individual' | 'Corporate' | 'Government'
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [searchTerm, filterType])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchTerm,
        type: filterType
      })
      
      const response = await fetch(`/api/clients?${params}`)
      if (!response.ok) throw new Error('Failed to fetch clients')
      const result = await response.json()
      setClients(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete client')
      }
      
      fetchClients() // Refresh the clients list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
    }
  }

  const clientColumns = [
    { key: 'name', label: 'Name', width: '200px' },
    { key: 'type', label: 'Type', width: '120px', align: 'center' as const },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'phone', label: 'Phone', width: '150px', align: 'center' as const },
    { key: 'status', label: 'Status', width: '100px', align: 'center' as const },
    { key: 'created_at', label: 'Created', width: '120px', align: 'center' as const },
    { key: 'actions', label: 'Actions', width: '80px', align: 'center' as const }
  ]

  const typeColors = {
    'Individual': 'text-blue-600 bg-blue-100',
    'Corporate': 'text-purple-600 bg-purple-100',
    'Government': 'text-green-600 bg-green-100'
  }

  const statusColors = {
    'Active': 'text-green-600 bg-green-100',
    'Inactive': 'text-gray-600 bg-gray-100'
  }

  const enhancedClientColumns = clientColumns.map(col => ({
    ...col,
    render: col.key === 'type' ? (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value as keyof typeof typeColors]}`}>
        {value}
      </span>
    ) : col.key === 'status' ? (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
        {value}
      </span>
    ) : col.key === 'created_at' ? (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString()}
      </span>
    ) : col.key === 'actions' ? (value: any, row: Client) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleEditClient(row)
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit client"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteClient(row.id)
          }}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete client"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Clients</h1>
          <p className="text-gray-600">Manage client information and relationships</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Clients</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {clients.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Corporate</span>
            <Building className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {clients.filter(c => c.type === 'Corporate').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Individual</span>
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {clients.filter(c => c.type === 'Individual').length}
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
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="government">Government</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchClients} className="btn-primary">Retry</button>
        </div>
      ) : (
        <Table
          columns={enhancedClientColumns}
          data={clients}
          onRowClick={(row) => console.log('Navigate to client details:', row.id)}
        />
      )}

      {/* Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingClient(null)
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <ClientForm
          initialData={editingClient ? {
            id: editingClient.id,
            name: editingClient.name,
            email: editingClient.email,
            phone: editingClient.phone,
            address: editingClient.address,
            type: editingClient.type,
            status: editingClient.status
          } : undefined}
          onSubmit={async (formData) => {
            try {
              if (editingClient) {
                // Update existing client
                const response = await fetch(`/api/clients/${editingClient.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to update client')
                }
              } else {
                // Create new client
                const response = await fetch('/api/clients', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                
                if (!response.ok) {
                  const result = await response.json()
                  throw new Error(result.error || 'Failed to add client')
                }
              }
              
              setIsModalOpen(false)
              setEditingClient(null)
              fetchClients() // Refresh the clients list
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            }
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingClient(null)
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
