"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, AlertCircle, ArrowRight } from "lucide-react"

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null)

  const alerts = [
    {
      id: 1,
      disease: "Dengue",
      severity: "Level 5 - Critical",
      severityColor: "text-red-700 bg-red-50",
      region: "North Lahore",
      message: "Unprecedented surge in dengue cases detected",
      forecast: "450+ cases in next 7 days",
      action: "Immediate intervention required",
      time: "2 hours ago",
      acknowledged: false,
    },
    {
      id: 2,
      disease: "Pneumonia",
      severity: "Level 4 - High",
      severityColor: "text-orange-700 bg-orange-50",
      region: "Central Lahore",
      message: "High pneumonia risk detected",
      forecast: "320+ cases in next 7 days",
      action: "Pre-position respiratory supplies",
      time: "4 hours ago",
      acknowledged: false,
    },
    {
      id: 3,
      disease: "Diarrhea",
      severity: "Level 3 - Medium",
      severityColor: "text-yellow-700 bg-yellow-50",
      region: "South Lahore",
      message: "Moderate diarrhea outbreak risk",
      forecast: "280+ cases in next 7 days",
      action: "Increase ORS availability",
      time: "6 hours ago",
      acknowledged: true,
    },
    {
      id: 4,
      disease: "COVID-19",
      severity: "Level 1 - Low",
      severityColor: "text-green-700 bg-green-50",
      region: "City Wide",
      message: "COVID-19 cases trending downward",
      forecast: "45+ cases in next 7 days",
      action: "Monitor situation",
      time: "1 day ago",
      acknowledged: true,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                Active Alerts
              </h1>
              <p className="text-slate-600 mt-2">{alerts.filter((a) => !a.acknowledged).length} active alerts</p>
            </div>
            <Link
              href="/health-official/dashboard"
              className="flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                  alert.acknowledged ? "bg-slate-50 border-slate-200" : `${alert.severityColor} border-current/30`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className={`w-5 h-5 ${alert.acknowledged ? "text-slate-500" : "text-current"}`} />
                      <span className="font-bold text-sm">{alert.severity}</span>
                      <span className="text-xs px-3 py-1 bg-current/10 text-current rounded-full font-medium">
                        {alert.disease}
                      </span>
                    </div>
                    <p className="font-semibold text-lg mb-1">{alert.message}</p>
                    <p className="text-sm opacity-90 mb-2">{alert.region}</p>
                    <p className="text-xs opacity-75">{alert.time}</p>
                  </div>
                  {!alert.acknowledged && (
                    <span className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">NEW</span>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedAlert === alert.id && (
                  <div className="mt-6 pt-6 border-t border-current/30 space-y-4">
                    <div>
                      <p className="text-xs font-semibold opacity-75 uppercase mb-1">Forecast</p>
                      <p className="font-semibold">{alert.forecast}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold opacity-75 uppercase mb-1">Recommended Action</p>
                      <p className="font-semibold">{alert.action}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 bg-current/20 text-current px-4 py-2 rounded font-medium hover:bg-current/30 transition-colors">
                        Acknowledge
                      </button>
                      <button className="flex-1 bg-primary text-white px-4 py-2 rounded font-medium hover:bg-primary/90 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
