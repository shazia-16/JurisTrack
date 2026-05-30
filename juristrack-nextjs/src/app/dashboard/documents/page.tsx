'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { documents, cases } from '@/data/dummyData'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText,
  Upload,
  Eye,
  Trash2
} from 'lucide-react'

export default function Documents() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const documentColumns = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'caseId', label: 'Case ID' },
    { key: 'uploadedDate', label: 'Uploaded' },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'size', label: 'Size' },
    { key: 'format', label: 'Format' }
  ]

  const typeColors = {
    'Complaint': 'text-red-600 bg-red-100',
    'Evidence': 'text-blue-600 bg-blue-100',
    'Contract': 'text-green-600 bg-green-100',
    'Motion': 'text-purple-600 bg-purple-100',
    'Order': 'text-orange-600 bg-orange-100',
    'Other': 'text-gray-600 bg-gray-100'
  }

  const formatIcons = {
    'PDF': '📄',
    'DOC': '📝',
    'ZIP': '📦',
    'XLS': '📊',
    'IMG': '🖼️'
  }

  const enhancedDocumentColumns = documentColumns.map(col => ({
    ...col,
    render: col.key === 'type' ? (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value as keyof typeof typeColors]}`}>
        {value}
      </span>
    ) : col.key === 'format' ? (value: string) => (
      <div className="flex items-center space-x-2">
        <span>{formatIcons[value as keyof typeof formatIcons] || '📄'}</span>
        <span className="text-sm">{value}</span>
      </div>
    ) : col.key === 'size' ? (value: string) => (
      <span className="text-sm text-gray-600">{value}</span>
    ) : col.key === 'title' ? (value: string, row: any) => (
      <div className="flex items-center space-x-2">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{value}</span>
      </div>
    ) : undefined
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Documents</h1>
          <p className="text-gray-600">Manage and organize case documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Documents</span>
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Week</span>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Storage Used</span>
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">2.4 GB</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Shared</span>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">8</p>
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
                placeholder="Search documents..."
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
              <option value="complaint">Complaint</option>
              <option value="evidence">Evidence</option>
              <option value="contract">Contract</option>
              <option value="motion">Motion</option>
              <option value="order">Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <Table
        columns={enhancedDocumentColumns}
        data={filteredDocuments}
        onRowClick={(row) => console.log('View document details:', row.id)}
      />

      {/* Add Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Document"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
            <input type="text" className="input-field" placeholder="Enter document title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select className="input-field">
              <option>Select type</option>
              <option>Complaint</option>
              <option>Evidence</option>
              <option>Contract</option>
              <option>Motion</option>
              <option>Order</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Associated Case</label>
            <select className="input-field">
              <option>Select case</option>
              {cases.map(caseItem => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.id} - {caseItem.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} placeholder="Enter document description"></textarea>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" className="btn-primary flex-1">
              Add Document
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
