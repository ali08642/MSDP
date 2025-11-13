"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Download, FileText, Calendar, Filter } from "lucide-react"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("forecast")
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-01-10")
  const [selectedDisease, setSelectedDisease] = useState("all")
  const [generating, setGenerating] = useState(false)

  const reports = [
    {
      id: 1,
      name: "Weekly Forecast Report (01-04 Jan)",
      type: "Forecast",
      date: "2025-01-10",
      size: "2.4 MB",
      format: "PDF",
    },
    { id: 2, name: "Dengue Outbreak Analysis", type: "Analysis", date: "2025-01-09", size: "1.8 MB", format: "PDF" },
    {
      id: 3,
      name: "Resource Estimation Summary",
      type: "Resource",
      date: "2025-01-09",
      size: "890 KB",
      format: "Excel",
    },
    { id: 4, name: "Monthly Disease Trends", type: "Trend", date: "2025-01-08", size: "3.1 MB", format: "PDF" },
  ]

  const handleGenerateReport = async () => {
    setGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGenerating(false)
    alert("Report generated successfully!")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              Reports & Export
            </h1>
            <p className="text-slate-600">Generate and download reports for data analysis and decision-making</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Report Generator */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-6">
                <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Generate Report
                </h2>

                <div className="space-y-4">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="forecast">Forecast Report</option>
                      <option value="analysis">Disease Analysis</option>
                      <option value="resource">Resource Estimation</option>
                      <option value="trend">Trend Analysis</option>
                    </select>
                  </div>

                  {/* Disease Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Disease</label>
                    <select
                      value={selectedDisease}
                      onChange={(e) => setSelectedDisease(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All Diseases</option>
                      <option value="dengue">Dengue</option>
                      <option value="malaria">Malaria</option>
                      <option value="covid">COVID-19</option>
                      <option value="pneumonia">Pneumonia</option>
                      <option value="diarrhea">Diarrhea</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
                  >
                    {generating ? "Generating..." : "Generate Report"}
                  </button>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-6">Recent Reports</h2>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{report.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{report.type}</span>
                          <span>{report.date}</span>
                          <span>{report.size}</span>
                          <span className="text-primary font-medium">{report.format}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                        <Download className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule Reports */}
              <div className="mt-12 bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-semibold text-foreground mb-4">Scheduled Reports</h3>
                <p className="text-sm text-slate-600 mb-4">Set up automatic report generation on a regular schedule</p>
                <button className="bg-slate-100 text-foreground px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                  Schedule Recurring Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
