'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter } from 'lucide-react'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('month')

  const reports = [
    { id: 'overview', name: 'Overview Report', description: 'General system statistics and trends' },
    { id: 'cases', name: 'Case Analysis', description: 'Detailed case performance metrics' },
    { id: 'hearings', name: 'Hearing Schedule', description: 'Hearing frequency and outcomes' },
    { id: 'clients', name: 'Client Analytics', description: 'Client demographics and engagement' },
    { id: 'financial', name: 'Financial Summary', description: 'Revenue and cost analysis' },
    { id: 'productivity', name: 'Productivity Report', description: 'Staff performance metrics' }
  ]

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Cases</h3>
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">1,247</p>
                <p className="text-sm text-green-600">↑ 12% from last month</p>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Active Cases</h3>
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">892</p>
                <p className="text-sm text-green-600">↑ 5% from last month</p>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">$124,500</p>
                <p className="text-sm text-green-600">↑ 8% from last month</p>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Distribution by Type</h3>
              <div className="space-y-3">
                {[
                  { type: 'Civil', count: 456, percentage: 36.5 },
                  { type: 'Criminal', count: 234, percentage: 18.8 },
                  { type: 'Family', count: 189, percentage: 15.2 },
                  { type: 'Corporate', count: 156, percentage: 12.5 },
                  { type: 'Other', count: 212, percentage: 17.0 }
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-700">{item.type}</span>
                      <span className="text-sm text-gray-500">({item.count} cases)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'cases':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Resolution Time</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Resolution Time</span>
                      <span className="font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fastest Resolution</span>
                      <span className="font-medium">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Longest Resolution</span>
                      <span className="font-medium">180 days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Success Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overall Success Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Settlement Rate</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trial Success Rate</span>
                      <span className="font-medium">82%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="glass-card p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Report Coming Soon</h3>
            <p className="text-gray-600">This report is currently under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view system reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Types Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Report Types</h3>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-white/50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{report.name}</div>
                  <div className={`text-xs mt-1 ${
                    selectedReport === report.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {report.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {reports.find(r => r.id === selectedReport)?.name}
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <button className="btn-secondary text-sm py-2 px-3">
                  Filter
                </button>
              </div>
            </div>
            {renderReportContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
