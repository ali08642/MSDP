"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { LogOut, Bell, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

export default function HealthOfficialLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const notifications = [
    { id: 1, title: "High Dengue Risk", message: "North Lahore region showing 35% increase", time: "2 hours ago" },
    { id: 2, title: "Model Updated", message: "LSTM model retrained with latest data", time: "4 hours ago" },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg" />
            <span>MSDP</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-8 space-y-4">
          <Link
            href="/health-official/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.organization || "Health Department"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-foreground"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-200">
                    <p className="font-semibold text-foreground">Notifications</p>
                  </div>
                  <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50">
                        <p className="font-medium text-foreground text-sm">{notif.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-slate-600">{user?.email}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
