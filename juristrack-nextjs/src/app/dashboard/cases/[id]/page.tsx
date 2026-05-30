'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Building2, 
  Clock, 
  AlertCircle,
  Download,
  Edit,
  Trash2,
  Scale,
  User,
  Plus
} from 'lucide-react'

interface CaseData {
  id: string
  title: string
  status: string
  court: string
  next_hearing_date: string
  created_at: string
  updated_at: string
}

// Dummy data for hearings and documents
const dummyHearings = [
  { id: 'HRG001', type: 'Initial Hearing', date: '2024-01-20', time: '09:00 AM', status: 'Completed', judge: 'Judge Robert Johnson' },
  { id: 'HRG002', type: 'Status Conference', date: '2024-01-25', time: '02:00 PM', status: 'Scheduled', judge: 'Judge Sarah Williams' },
  { id: 'HRG003', type: 'Pre-trial Motion', date: '2024-02-01', time: '10:30 AM', status: 'Scheduled', judge: 'Judge Michael Brown' }
]

const dummyDocuments = [
  { id: 'DOC001', title: 'Initial Complaint', type: 'Complaint', format: 'PDF', size: '2.5 MB', uploadedDate: '2024-01-15', uploadedBy: 'John Smith' },
  { id: 'DOC002', title: 'Evidence Photos', type: 'Evidence', format: 'ZIP', size: '15.3 MB', uploadedDate: '2024-01-16', uploadedBy: 'Legal Team' },
  { id: 'DOC003', title: 'Witness Statements', type: 'Evidence', format: 'PDF', size: '1.2 MB', uploadedDate: '2024-01-17', uploadedBy: 'Jane Doe' }
]

export default function CaseDetails() {
  const params = useParams()
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const caseId = params.id as string

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails()
    }
  }, [caseId])

  const fetchCaseDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cases/${caseId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Case not found')
        }
        throw new Error('Failed to fetch case details')
      }
      const data = await response.json()
      setCaseData(data.case)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="btn-primary mr-2"
        >
          Go Back
        </button>
        <button
          onClick={fetchCaseDetails}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Case Not Found</h2>
        <p className="text-gray-600 mb-4">The case you're looking for doesn't exist.</p>
        <button
          onClick={() => router.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    )
  }

  const statusColors = {
    'Active': 'text-green-600 bg-green-100',
    'Pending': 'text-yellow-600 bg-yellow-100',
    'Closed': 'text-gray-600 bg-gray-100'
  }

  const hearingStatusColors = {
    'Completed': 'text-green-600 bg-green-100',
    'Scheduled': 'text-blue-600 bg-blue-100',
    'Postponed': 'text-yellow-600 bg-yellow-100',
    'Cancelled': 'text-red-600 bg-red-100'
  }

  const documentTypeColors = {
    'Complaint': 'text-red-600 bg-red-100',
    'Evidence': 'text-blue-600 bg-blue-100',
    'Contract': 'text-green-600 bg-green-100',
    'Motion': 'text-purple-600 bg-purple-100',
    'Order': 'text-orange-600 bg-orange-100'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{caseData.title}</h1>
            <p className="text-gray-600">Case ID: {caseData.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Case Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Case Info Card */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{caseData.title}</h2>
              <p className="text-sm text-gray-600">Case Details</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case ID</label>
              <p className="text-gray-800 font-mono">{caseData.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[caseData.status as keyof typeof statusColors]}`}>
                {caseData.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <p className="text-gray-800">{new Date(caseData.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-800">{new Date(caseData.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Court Details Card */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Court Details</h2>
              <p className="text-sm text-gray-600">Location & Schedule</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Court</label>
              <p className="text-gray-800">{caseData.court || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Hearing Date</label>
              <p className="text-gray-800">
                {caseData.next_hearing_date 
                  ? new Date(caseData.next_hearing_date).toLocaleDateString()
                  : 'Not scheduled'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Until Hearing</label>
              <p className="text-gray-800">
                {caseData.next_hearing_date 
                  ? Math.max(0, Math.ceil((new Date(caseData.next_hearing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                  : 'N/A'
                } days
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
              <p className="text-sm text-gray-600">Manage case</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Hearing</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Add Document</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
              <span>Assign Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hearing History Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Hearing History</h2>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Hearing</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {dummyHearings.map((hearing) => (
            <div key={hearing.id} className="border border-gray-200/50 rounded-lg p-4 hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{hearing.type}</h3>
                    <p className="text-sm text-gray-600">{hearing.date} at {hearing.time}</p>
                    <p className="text-sm text-gray-600">{hearing.judge}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${hearingStatusColors[hearing.status as keyof typeof hearingStatusColors]}`}>
                  {hearing.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Documents</h2>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {dummyDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200/50 rounded-lg p-4 hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${documentTypeColors[doc.type as keyof typeof documentTypeColors]}`}>
                        {doc.type}
                      </span>
                      <span>{doc.format}</span>
                      <span>{doc.size}</span>
                      <span>Uploaded {doc.uploadedDate}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
