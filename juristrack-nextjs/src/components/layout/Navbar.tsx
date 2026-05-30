'use client'

import { Bell, Search, Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface NavbarProps {
  onMenuToggle?: () => void
  isSidebarOpen?: boolean
}

export function Navbar({ onMenuToggle, isSidebarOpen = true }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, text: 'New case assigned: Smith v. Johnson', time: '5 min ago', read: false },
    { id: 2, text: 'Hearing scheduled for tomorrow at 2:00 PM', time: '1 hour ago', read: false },
    { id: 3, text: 'Document uploaded for Case #1234', time: '2 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="glass-navbar px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Search */}
          <div className="relative">
            {isSearchOpen && (
              <div className="absolute -top-2 -left-4 w-80 sm:w-96 glass-card p-4 z-50 animate-scale-in">
                <input
                  type="text"
                  placeholder="Search cases, clients, documents..."
                  className="input-field w-full"
                  autoFocus
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
              </div>
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
            >
              <Search className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Last Login - Hidden on small screens */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">Last login:</span>
            <span>Today, 9:30 AM</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              className="relative p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-card p-4 z-50 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : 'hover:bg-white/50'
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700">
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">JD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-primary-600 transition-colors hidden sm:block" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-50 animate-scale-in">
                <div className="px-3 py-2 border-b border-gray-200/50">
                  <p className="font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-600">john.doe@juristrack.com</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-white/50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-white/50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
