"use client"

import { Activity } from "lucide-react"

export default function AuditLog() {
  const logs = [
    { id: 1, user: "Dr. Ahmed Hassan", action: "Viewed dashboard", time: "10:30 AM" },
    { id: 2, user: "Fatima Khan", action: "Submitted pharmacy data", time: "10:15 AM" },
    { id: 3, user: "Admin User", action: "Retrained LSTM model", time: "09:45 AM" },
    { id: 4, user: "Mohammad Ali", action: "Submitted lab results", time: "09:20 AM" },
    { id: 5, user: "System", action: "Generated daily forecasts", time: "06:00 AM" },
  ]

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Audit Log</h2>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">User</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{log.user}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{log.action}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
