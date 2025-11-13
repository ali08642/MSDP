"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

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
          <Link href="/lab/data-entry" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white">
            <span>Test Results</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500">Lab Technician</p>
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

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-sm font-medium text-slate-600">{user?.email}</span>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
