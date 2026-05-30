'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StatCard } from '@/components/ui/StatCard'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { CaseForm } from '@/components/forms/CaseForm'
import { HearingForm } from '@/components/forms/HearingForm'
import { ClientForm } from '@/components/forms/ClientForm'
import { FileText, Calendar, Users, Clock, TrendingUp, Plus, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalClients: 0,
    todayHearings: 0,
    upcomingHearings: 0
  })
  const [recentCases, setRecentCases] = useState([])
  const [upcomingHearings, setUpcomingHearings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [isHearingModalOpen, setIsHearingModalOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost:3000/api/dashboard')
      if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats')
      const statsData = await statsResponse.json()
      
      // Fetch recent cases
      const recentCasesResponse = await fetch('http://localhost:3000/api/recent-cases')
      if (!recentCasesResponse.ok) throw new Error('Failed to fetch recent cases')
      const recentCasesData = await recentCasesResponse.json()
      
      // Fetch upcoming hearings
      const upcomingHearingsResponse = await fetch('http://localhost:3000/api/upcoming-hearings')
      if (!upcomingHearingsResponse.ok) throw new Error('Failed to fetch upcoming hearings')
      const upcomingHearingsData = await upcomingHearingsResponse.json()

      // Set the data
      setStats({
        totalCases: statsData.totalCases || 0,
        activeCases: statsData.activeCases || 0,
        closedCases: statsData.closedCases || 0,
        totalClients: statsData.totalClients || 0,
        todayHearings: statsData.todayHearings || 0,
        upcomingHearings: statsData.upcomingHearings || 0
      })
      
      setRecentCases(recentCasesData)
      setUpcomingHearings(upcomingHearingsData)

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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const caseColumns = [
    { key: 'id', label: 'Case ID' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'court', label: 'Court' }
  ]

  const hearingColumns = [
    { key: 'id', label: 'Hearing ID' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'courtroom', label: 'Courtroom' },
    { key: 'case_title', label: 'Case' }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your court management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          change="All cases in system"
          changeType="neutral"
          icon={<FileText className="w-6 h-6 text-primary-600" />}
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          change="Currently active"
          changeType="increase"
          icon={<Clock className="w-6 h-6 text-primary-600" />}
        />
        <StatCard
          title="Closed Cases"
          value={stats.closedCases}
          change="Completed cases"
          changeType="neutral"
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          change="Registered clients"
          changeType="increase"
          icon={<Users className="w-6 h-6 text-primary-600" />}
        />
        <StatCard
          title="Today's Hearings"
          value={stats.todayHearings}
          change="Scheduled for today"
          changeType="neutral"
          icon={<Calendar className="w-6 h-6 text-primary-600" />}
        />
        <StatCard
          title="Upcoming Hearings"
          value={stats.upcomingHearings}
          change="Future hearings"
          changeType="increase"
          icon={<Clock className="w-6 h-6 text-primary-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Recent Cases</h2>
            <button 
              onClick={() => router.push('/dashboard/cases')}
              className="btn-primary text-sm py-2 px-3 hover:opacity-90 transition-opacity"
            >
              View All
            </button>
          </div>
          <Table
            columns={caseColumns}
            data={recentCases}
            onRowClick={(row) => router.push(`/dashboard/cases`)}
          />
        </div>

        {/* Upcoming Hearings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Hearings</h2>
            <button 
              onClick={() => router.push('/dashboard/calendar')}
              className="btn-primary text-sm py-2 px-3 hover:opacity-90 transition-opacity"
            >
              View Calendar
            </button>
          </div>
          <Table
            columns={hearingColumns}
            data={upcomingHearings}
            onRowClick={(row) => router.push('/dashboard/hearings')}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setIsCaseModalOpen(true)}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>New Case</span>
          </button>
          <button 
            onClick={() => setIsHearingModalOpen(true)}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Schedule Hearing</span>
          </button>
          <button 
            onClick={() => setIsClientModalOpen(true)}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Case Modal */}
      <Modal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        title="Create New Case"
        size="lg"
      >
        <CaseForm
          onSubmit={async (formData) => {
            try {
              setIsSubmitting(true)
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
              
              setIsCaseModalOpen(false)
              fetchDashboardData() // Refresh dashboard data
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => setIsCaseModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Hearing Modal */}
      <Modal
        isOpen={isHearingModalOpen}
        onClose={() => setIsHearingModalOpen(false)}
        title="Schedule New Hearing"
        size="lg"
      >
        <HearingForm
          onSubmit={async (formData) => {
            try {
              setIsSubmitting(true)
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
              
              setIsHearingModalOpen(false)
              fetchDashboardData() // Refresh dashboard data
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => setIsHearingModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Client Modal */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Add New Client"
        size="lg"
      >
        <ClientForm
          onSubmit={async (formData) => {
            try {
              setIsSubmitting(true)
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
              
              setIsClientModalOpen(false)
              fetchDashboardData() // Refresh dashboard data
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => setIsClientModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
