"use client"

export default function PharmacyHistory() {
  const entries = [
    { id: 1, date: "2025-01-10", medicines: 24, status: "Submitted", submitted: "10:30 AM" },
    { id: 2, date: "2025-01-09", medicines: 18, status: "Submitted", submitted: "09:15 AM" },
    { id: 3, date: "2025-01-08", medicines: 21, status: "Submitted", submitted: "08:45 AM" },
    { id: 4, date: "2025-01-07", medicines: 19, status: "Submitted", submitted: "10:00 AM" },
    { id: 5, date: "2025-01-06", medicines: 23, status: "Submitted", submitted: "09:30 AM" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-foreground">Submission History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Medicines</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Submitted</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{entry.date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{entry.medicines} items</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{entry.submitted}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
