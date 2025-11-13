"use client"

import { Activity, Database, Zap, AlertCircle } from "lucide-react"

export default function SystemMonitoring() {
  return (
    <div className="space-y-8">
      {/* System Status Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">System Status</p>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">Operational</p>
          <p className="text-xs text-slate-500 mt-2">99.9% uptime</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">Database</p>
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">23.4 GB</p>
          <p className="text-xs text-slate-500 mt-2">of 50 GB used</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">Active Users</p>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-slate-500 mt-2">Currently online</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">Forecasts Today</p>
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">48</p>
          <p className="text-xs text-slate-500 mt-2">Generated</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-foreground mb-6">Recent System Activity</h3>
        <div className="space-y-4">
          {[
            { time: "10:30 AM", event: "LSTM model retrained successfully", status: "success" },
            { time: "09:15 AM", event: "Lab data upload processed (487 records)", status: "success" },
            { time: "08:00 AM", event: "Daily forecasts generated for all diseases", status: "success" },
            { time: "07:45 AM", event: "Pharmacy data validation completed", status: "success" },
            { time: "06:30 PM (Yesterday)", event: "System backup completed", status: "success" },
          ].map((activity, idx) => (
            <div key={idx} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
              <div className="pt-1">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.event}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
