'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Scale, 
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Judge {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  experience: string
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

export default function Judges() {
  const [judges, setJudges] = useState<Judge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null)

  useEffect(() => {
    fetchJudges()
  }, [])

  const fetchJudges = async () => {
    try {
      const response = await fetch('/api/judges')
      if (!response.ok) {
        throw new Error('Failed to fetch judges')
      }
      const data = await response.json()
      setJudges(data.judges || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch judges')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (judgeData: Judge) => {
    try {
      const url = editingJudge ? `/api/judges/${editingJudge.id}` : '/api/judges'
      const method = editingJudge ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(judgeData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save judge')
      }

      const result = await response.json()
      
      if (editingJudge) {
        setJudges(prev => prev.map(judge => 
          judge.id === editingJudge.id ? result.judge : judge
        ))
      } else {
        setJudges(prev => [...prev, result.judge])
      }

      setIsModalOpen(false)
      setEditingJudge(null)
    } catch (err) {
      console.error('Judge save error:', err)
    }
  }

  const handleDelete = async (judgeId: string) => {
    if (!confirm('Are you sure you want to delete this judge?')) return
    
    try {
      const response = await fetch(`/api/judges/${judgeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete judge')
      }

      setJudges(prev => prev.filter(judge => judge.id !== judgeId))
    } catch (err) {
      console.error('Judge deletion error:', err)
    }
  }

  const filteredJudges = judges.filter(judge => 
    judge.name.toLowerCase().includes(search.toLowerCase()) ||
    judge.email.toLowerCase().includes(search.toLowerCase()) ||
    judge.specialization.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading judges...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Judges</h2>
        <Button
          onClick={() => {
            setEditingJudge(null)
            setIsModalOpen(true)
          }}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Judge</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search judges by name, email, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Judges Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJudges.map((judge, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{judge.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.experience}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    judge.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {judge.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setEditingJudge(judge)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(judge.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Judge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingJudge ? 'Edit Judge' : 'Add New Judge'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingJudge(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = {
                name: editingJudge?.name || '',
                email: editingJudge?.email || '',
                phone: editingJudge?.phone || '',
                specialization: editingJudge?.specialization || '',
                experience: editingJudge?.experience || '',
                status: editingJudge?.status || 'Active'
              }
              handleSubmit(formData)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingJudge?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingJudge?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingJudge?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <select
                  name="specialization"
                  defaultValue={editingJudge?.specialization || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Bankruptcy">Bankruptcy</option>
                  <option value="Immigration">Immigration</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  defaultValue={editingJudge?.experience || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingJudge?.status || 'Active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingJudge(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingJudge ? 'Update Judge' : 'Add Judge'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
