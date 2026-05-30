'use client'

import { useState } from 'react'
import { 
  Users, 
  User,
  Plus, 
  Edit,
  Trash2,
  Settings, 
  Shield, 
  Database, 
  Bell, 
  FileText,
  Save,
  CheckCircle
} from 'lucide-react'
import UserForm from '@/components/forms/UserForm'
import JudgeForm from '@/components/forms/JudgeForm'
import TaskForm from '@/components/forms/TaskForm'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false)
  const [editingJudge, setEditingJudge] = useState<any>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [users, setUsers] = useState([
    { name: 'John Doe', email: 'john@juristrack.com', role: 'Administrator', status: 'Active', lastLogin: '2024-01-15 09:30 AM' },
    { name: 'Jane Smith', email: 'jane@juristrack.com', role: 'Attorney', status: 'Active', lastLogin: '2024-01-15 08:45 AM' },
    { name: 'Bob Johnson', email: 'bob@juristrack.com', role: 'Paralegal', status: 'Inactive', lastLogin: '2024-01-10 02:15 PM' },
    { name: 'Sarah Wilson', email: 'sarah@juristrack.com', role: 'Staff', status: 'Active', lastLogin: '2024-01-14 04:20 PM' }
  ])

  const [judges, setJudges] = useState([
    { name: 'Judge Robert Johnson', email: 'r.johnson@court.gov', phone: '555-0201', court: 'Superior Court', status: 'Active' },
    { name: 'Judge Sarah Williams', email: 's.williams@court.gov', phone: '555-0202', court: 'District Court', status: 'Active' },
    { name: 'Judge Michael Brown', email: 'm.brown@court.gov', phone: '555-0203', court: 'Circuit Court', status: 'Active' },
    { name: 'Judge Emily Davis', email: 'e.davis@court.gov', phone: '555-0204', court: 'Municipal Court', status: 'On Leave' },
    { name: 'Judge James Wilson', email: 'j.wilson@court.gov', phone: '555-0205', court: 'Federal Court', status: 'Active' }
  ])

  const [tasks, setTasks] = useState([
    { title: 'Review case documents', assignedTo: 'John Doe', priority: 'High', status: 'In Progress', dueDate: '2024-01-20' },
    { title: 'Schedule hearing for CASE0002', assignedTo: 'Jane Smith', priority: 'Medium', status: 'Pending', dueDate: '2024-01-21' },
    { title: 'Update client information', assignedTo: 'Bob Johnson', priority: 'Low', status: 'Completed', dueDate: '2024-01-18' },
    { title: 'Prepare court filings', assignedTo: 'Sarah Wilson', priority: 'High', status: 'In Progress', dueDate: '2024-01-22' },
    { title: 'Follow up on evidence submission', assignedTo: 'John Doe', priority: 'Medium', status: 'Pending', dueDate: '2024-01-23' }
  ])

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'judges', label: 'Judges', icon: User },
    { id: 'tasks', label: 'Tasks & Activities', icon: CheckCircle },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'backup', label: 'Backup & Recovery', icon: Database },
    { id: 'logs', label: 'Activity Logs', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const handleUserSubmit = async (userData: any) => {
    try {
      // TODO: Call API to create/update user
      console.log('User data:', userData)
      
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.email === editingUser.email ? { ...userData } : user
        ))
      } else {
        // Add new user
        setUsers(prev => [...prev, userData])
      }
      
      setIsUserModalOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error('User creation error:', error)
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = async (userEmail: string) => {
    try {
      // TODO: Call API to delete user
      console.log('Deleting user:', userEmail)
      setUsers(prev => prev.filter(user => user.email !== userEmail))
    } catch (error) {
      console.error('User deletion error:', error)
    }
  }

  const handleJudgeSubmit = async (judgeData: any) => {
    try {
      // TODO: Call API to create/update judge
      console.log('Judge data:', judgeData)
      
      if (editingJudge) {
        // Update existing judge
        setJudges(prev => prev.map(judge => 
          judge.email === editingJudge.email ? { ...judgeData } : judge
        ))
      } else {
        // Add new judge
        setJudges(prev => [...prev, judgeData])
      }
      
      setIsJudgeModalOpen(false)
      setEditingJudge(null)
    } catch (error) {
      console.error('Judge creation error:', error)
    }
  }

  const handleEditJudge = (judge: any) => {
    setEditingJudge(judge)
    setIsJudgeModalOpen(true)
  }

  const handleDeleteJudge = async (judgeEmail: string) => {
    try {
      // TODO: Call API to delete judge
      console.log('Deleting judge:', judgeEmail)
      setJudges(prev => prev.filter(judge => judge.email !== judgeEmail))
    } catch (error) {
      console.error('Judge deletion error:', error)
    }
  }

  const handleTaskSubmit = async (taskData: any) => {
    try {
      // TODO: Call API to create/update task
      console.log('Task data:', taskData)
      
      if (editingTask) {
        // Update existing task
        setTasks(prev => prev.map(task => 
          task.title === editingTask.title ? { ...taskData } : task
        ))
      } else {
        // Add new task
        setTasks(prev => [...prev, taskData])
      }
      
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Task creation error:', error)
    }
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = async (taskTitle: string) => {
    try {
      // TODO: Call API to delete task
      console.log('Deleting task:', taskTitle)
      setTasks(prev => prev.filter(task => task.title !== taskTitle))
    } catch (error) {
      console.error('Task deletion error:', error)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
              <button 
                onClick={() => {
                  setEditingUser(null)
                  setIsUserModalOpen(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
            
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.email)}
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
          </div>
        )
      
      case 'judges':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Judge Management</h3>
              <button 
                onClick={() => {
                  setEditingJudge(null)
                  setIsJudgeModalOpen(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Judge</span>
              </button>
            </div>
            
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {judges.map((judge, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{judge.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.court}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          judge.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {judge.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditJudge(judge)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJudge(judge.email)}
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
          </div>
        )
      
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Tasks & Activities</h3>
              <button 
                onClick={() => {
                  setEditingTask(null)
                  setIsTaskModalOpen(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
            
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.title)}
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
          </div>
        )
      
      case 'roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Roles & Permissions</h3>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Administrator', permissions: ['Full System Access', 'User Management', 'System Settings', 'All Data Access'], users: 2 },
                { name: 'Attorney', permissions: ['Case Management', 'Document Access', 'Hearing Scheduling', 'Client Management'], users: 8 },
                { name: 'Paralegal', permissions: ['Case Viewing', 'Document Upload', 'Basic Reporting'], users: 12 },
                { name: 'Staff', permissions: ['Limited Case Access', 'Document Viewing'], users: 15 }
              ].map((role, index) => (
                <div key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">{role.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Users:</span> {role.users}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                      <div className="space-y-1">
                        {role.permissions.map((permission, permIndex) => (
                          <div key={permIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'system':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
            
            <div className="glass-card p-6">
              <h4 className="font-medium text-gray-800 mb-4">General Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                  <input type="text" className="input-field" defaultValue="JurisTrack" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                  <select className="input-field">
                    <option>UTC-05:00 Eastern Time</option>
                    <option>UTC-06:00 Central Time</option>
                    <option>UTC-07:00 Mountain Time</option>
                    <option>UTC-08:00 Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select className="input-field">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h4 className="font-medium text-gray-800 mb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Require 2FA for all users</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Session Timeout</p>
                    <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                  </div>
                  <select className="input-field w-32">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        )
      
      case 'logs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Activity Logs</h3>
              <button className="btn-secondary flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Export Logs</span>
              </button>
            </div>
            
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { timestamp: '2024-01-15 09:30:15', user: 'John Doe', activity: 'Created new case', module: 'Cases', ip: '192.168.1.100', status: 'Success' },
                    { timestamp: '2024-01-15 09:25:42', user: 'Jane Smith', activity: 'Updated hearing schedule', module: 'Hearings', ip: '192.168.1.101', status: 'Success' },
                    { timestamp: '2024-01-15 09:18:33', user: 'Bob Johnson', activity: 'Uploaded document', module: 'Documents', ip: '192.168.1.102', status: 'Success' },
                    { timestamp: '2024-01-15 09:12:18', user: 'Sarah Wilson', activity: 'Failed login attempt', module: 'Auth', ip: '192.168.1.103', status: 'Failed' },
                    { timestamp: '2024-01-15 08:55:27', user: 'John Doe', activity: 'Modified client information', module: 'Clients', ip: '192.168.1.100', status: 'Success' },
                    { timestamp: '2024-01-15 08:45:12', user: 'Jane Smith', activity: 'Generated report', module: 'Reports', ip: '192.168.1.101', status: 'Success' },
                    { timestamp: '2024-01-15 08:30:45', user: 'Bob Johnson', activity: 'Deleted case file', module: 'Cases', ip: '192.168.1.102', status: 'Success' },
                    { timestamp: '2024-01-15 08:15:33', user: 'Sarah Wilson', activity: 'Updated user permissions', module: 'Admin', ip: '192.168.1.103', status: 'Success' }
                  ].map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.activity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.module}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="glass-card p-12 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-600">This admin feature is currently under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">System administration and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Admin Navigation */}
        <div className="lg:w-64">
          <div className="glass-card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Admin Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* User Modal */}
      <UserForm
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false)
          setEditingUser(null)
        }}
        onSubmit={handleUserSubmit}
        initialData={editingUser}
      />

      {/* Judge Modal */}
      <JudgeForm
        isOpen={isJudgeModalOpen}
        onClose={() => {
          setIsJudgeModalOpen(false)
          setEditingJudge(null)
        }}
        onSubmit={handleJudgeSubmit}
        initialData={editingJudge}
      />

      {/* Task Modal */}
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
      />
    </div>
  )
}
