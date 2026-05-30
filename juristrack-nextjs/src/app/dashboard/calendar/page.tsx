'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { HearingForm } from '@/components/forms/HearingForm'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User,
  Plus
} from 'lucide-react'

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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHearings()
  }, [])

  const fetchHearings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/hearings')
      if (!response.ok) throw new Error('Failed to fetch hearings')
      const result = await response.json()
      setHearings(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hearings')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getHearingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    
    // Try multiple date format comparisons
    const filtered = hearings.filter(hearing => {
      // Direct comparison
      if (hearing.date === dateStr) return true
      
      // Try parsing hearing date and compare
      try {
        const hearingDate = new Date(hearing.date)
        const hearingDateStr = hearingDate.toISOString().split('T')[0]
        if (hearingDateStr === dateStr) return true
      } catch (e) {
        // Invalid date format, skip
      }
      
      return false
    })
    
    return filtered
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayHearings = getHearingsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-24 border border-gray-100 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${
            isToday ? 'bg-blue-50 border-blue-200' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayHearings.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                {dayHearings.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dayHearings.slice(0, 2).map((hearing: Hearing, index: number) => (
              <div
                key={index}
                className="text-xs p-1 bg-blue-50 rounded text-blue-700 truncate"
                title={`${hearing.case_title} - ${hearing.type}`}
              >
                {hearing.time} {hearing.type}
              </div>
            ))}
            {dayHearings.length > 2 && (
              <div className="text-xs text-gray-500">+{dayHearings.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
          <p className="text-gray-600">View and manage court hearings schedule</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white rounded-lg border border-gray-200">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                } ${viewType === 'month' ? 'rounded-l-lg' : ''} ${viewType === 'day' ? 'rounded-r-lg' : ''}`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Schedule Hearing</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {formatDate(currentDate)}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {renderMonthView()}
        </div>
      </div>

      {/* Upcoming Hearings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Hearings</h3>
        <div className="space-y-3">
          {hearings
            .filter((h: Hearing) => new Date(h.date) >= new Date())
            .sort((a: Hearing, b: Hearing) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((hearing: Hearing) => (
              <div key={hearing.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{hearing.case_title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{hearing.date} at {hearing.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hearing.courtroom}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{hearing.judge}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hearing.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                  hearing.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {hearing.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Hearing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDate(null)
        }}
        title={`Schedule Hearing for ${selectedDate ? selectedDate.toLocaleDateString() : ''}`}
        size="lg"
      >
        <HearingForm
          initialData={selectedDate ? {
            date: selectedDate.toISOString().split('T')[0],
            type: '',
            time: '',
            courtroom: '',
            status: 'Scheduled',
            judge: '',
            case_id: ''
          } : undefined}
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
              
              setIsModalOpen(false)
              setSelectedDate(null)
              
              // Add small delay to ensure database is updated, then refresh
              setTimeout(() => {
                fetchHearings() // Refresh hearings
              }, 500)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedDate(null)
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
