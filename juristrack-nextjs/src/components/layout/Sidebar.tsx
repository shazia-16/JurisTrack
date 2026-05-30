'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Scale,
  Gavel,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cases', href: '/dashboard/cases', icon: FileText },
  { name: 'Hearings', href: '/dashboard/hearings', icon: Gavel },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Admin', href: '/dashboard/admin', icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export function Sidebar({ isOpen = true, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "glass-sidebar min-h-screen flex flex-col transition-all duration-300 ease-in-out",
        "fixed lg:static lg:translate-x-0 z-50",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "w-64",
        !isMobile && (isOpen ? "w-64" : "w-0 lg:w-64")
      )}>
        {/* Header */}
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className={cn("transition-opacity duration-300", !isOpen && !isMobile && "lg:opacity-100 opacity-0")}>
              <h1 className="text-xl font-bold text-gray-800">JurisTrack</h1>
              <p className="text-xs text-gray-600">Court Management</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50 hover:shadow-md',
                  !isOpen && !isMobile && "lg:justify-center"
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-500'
                  )}
                />
                <span className={cn(
                  'font-medium transition-opacity duration-300',
                  isActive ? 'text-white' : 'text-gray-700',
                  !isOpen && !isMobile && "lg:hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className={cn(
          "p-4 border-t border-white/20 transition-opacity duration-300",
          !isOpen && !isMobile && "lg:opacity-100 opacity-0"
        )}>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">JD</span>
              </div>
              <div className={cn("transition-opacity duration-300", !isOpen && !isMobile && "lg:hidden")}>
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
            </div>
            <button className="w-full btn-secondary text-sm py-2">
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
