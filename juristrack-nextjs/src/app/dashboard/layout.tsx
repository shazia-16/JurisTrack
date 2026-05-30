'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Sidebar - Only visible on mobile */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={handleSidebarClose} 
          isMobile={true} 
        />
      </div>
      
      {/* Desktop Sidebar - Only visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={true} 
          isMobile={false} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar 
          onMenuToggle={handleMenuToggle} 
          isSidebarOpen={isMobileSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-white/30 via-transparent to-transparent">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
