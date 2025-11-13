"use client"

import { Bell, X } from "lucide-react"
import { useState } from "react"

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: "critical", title: "Dengue Alert - Level 5", message: "North Lahore outbreak detected", time: "2h" },
    { id: 2, type: "warning", title: "Pneumonia Risk Elevated", message: "Central Lahore region affected", time: "4h" },
    { id: 3, type: "info", title: "Daily Forecast Updated", message: "New predictions available", time: "6h" },
  ])

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getColorClasses = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-900"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-900"
      default:
        return "bg-slate-50 border-slate-200 text-slate-900"
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-foreground transition-colors"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-l-4 border-l-transparent hover:bg-slate-50 transition-colors ${getColorClasses(notif.type)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <p className="text-xs opacity-75 mt-1">{notif.message}</p>
                        <p className="text-xs opacity-60 mt-2">{notif.time} ago</p>
                      </div>
                      <button
                        onClick={() => handleDismiss(notif.id)}
                        className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-600">No notifications</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
