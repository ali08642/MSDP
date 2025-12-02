"use client"

import { useState, useEffect } from "react"
import { DownloadCloud, RefreshCw, AlertCircle, TrendingUp, Calendar, CalendarIcon } from "lucide-react"
import { api } from "@/lib/api"
import type { Forecast } from "@/lib/types/forecasting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

export default function DiseaseForecasts() {
  const [selectedDisease, setSelectedDisease] = useState("MALARIA")
  const [horizon, setHorizon] = useState("30")
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // New state for custom date range query
  const [availableDates, setAvailableDates] = useState<any>(null)
  const [customStartDate, setCustomStartDate] = useState<Date>()
  const [customDaysAhead, setCustomDaysAhead] = useState("30")
  const [showCustomQuery, setShowCustomQuery] = useState(false)
  const [customForecasts, setCustomForecasts] = useState<any>(null)

  // Updated to match Django backend disease names
  const diseases = ["MALARIA", "DENGUE"]
  const diseaseNames: Record<string, string> = {
    MALARIA: "Malaria",
    DENGUE: "Dengue",
  }

  // Fetch forecasts when disease or horizon changes
  useEffect(() => {
    loadForecasts()
    loadAvailableDates()
  }, [selectedDisease, horizon])

  const loadForecasts = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.forecasting.listForecasts({
        disease: selectedDisease,
      })
      
      // Handle both paginated and non-paginated responses
      const data = Array.isArray(response) ? response : (response.results || [])
      
      if (data.length === 0) {
        setError(`No forecasts available for ${diseaseNames[selectedDisease]}. Models may need to be trained.`)
        setForecasts([])
        return
      }
      
      // Filter to get only the requested number of days
      const days = Number.parseInt(horizon)
      setForecasts(data.slice(0, days))
    } catch (err: any) {
      setError(err?.message || "Failed to load forecasts")
      console.error('Error loading forecasts:', err)
      setForecasts([])
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableDates = async () => {
    try {
      const response = await api.forecasting.getAvailableDates(selectedDisease)
      setAvailableDates(response)
      
      // Set default custom start date to first available date
      if (response.date_range?.start) {
        setCustomStartDate(parseISO(response.date_range.start))
      }
    } catch (err) {
      console.error('Error loading available dates:', err)
    }
  }

  const handleCustomQuery = async () => {
    if (!customStartDate) {
      setError("Please select a start date")
      return
    }

    setLoading(true)
    setError("")
    setCustomForecasts(null)

    try {
      const response = await api.forecasting.getForecastDetail({
        disease: selectedDisease,
        start_date: format(customStartDate, "yyyy-MM-dd"),
        days_ahead: Number.parseInt(customDaysAhead),
      })
      
      setCustomForecasts(response)
      setShowCustomQuery(true)
    } catch (err: any) {
      if (err.status === 404) {
        setError(err.data?.error || "No forecasts available for this date range")
        if (err.data?.available_range) {
          setError(
            `No forecasts available for this date range. Available: ${err.data.available_range.start} to ${err.data.available_range.end}`
          )
        }
      } else {
        setError(err?.message || "Failed to load custom forecast")
      }
      console.error('Error loading custom forecast:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-700">{error}</p>
            <p className="text-xs text-yellow-600 mt-1">Showing mock data for demonstration</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            >
              {diseases.map((d) => (
                <option key={d} value={d}>
                  {diseaseNames[d]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Forecast Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          <div>
            <button 
              onClick={loadForecasts}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div>
            <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2">
              <DownloadCloud className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range Query */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Custom Forecast Query
        </h2>
        
        {availableDates && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Available forecasts: <span className="font-semibold">{availableDates.total_forecasts} days</span> from{" "}
              <span className="font-semibold">{availableDates.date_range?.start}</span> to{" "}
              <span className="font-semibold">{availableDates.date_range?.end}</span>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={customStartDate ? format(customStartDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setCustomStartDate(e.target.value ? parseISO(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Days Ahead</label>
            <input
              type="number"
              value={customDaysAhead}
              onChange={(e) => setCustomDaysAhead(e.target.value)}
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <button 
              onClick={handleCustomQuery}
              disabled={loading || !customStartDate}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              Query Forecasts
            </button>
          </div>
        </div>

        {customForecasts && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold mb-2">Query Summary</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Total Days:</p>
                <p className="font-semibold">{customForecasts.summary?.total_days}</p>
              </div>
              <div>
                <p className="text-slate-600">Days with Actual Data:</p>
                <p className="font-semibold">{customForecasts.summary?.days_with_actual}</p>
              </div>
              <div>
                <p className="text-slate-600">Average Accuracy:</p>
                <p className="font-semibold">
                  {customForecasts.summary?.average_accuracy 
                    ? `${customForecasts.summary.average_accuracy}%`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Average MAE:</p>
                <p className="font-semibold">
                  {customForecasts.summary?.average_mae 
                    ? customForecasts.summary.average_mae.toFixed(2)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {diseaseNames[selectedDisease]} Forecast ({horizon}-Day)
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-slate-600">Loading forecast data...</p>
            </div>
          </div>
        ) : forecasts.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No forecast data available</p>
              <p className="text-sm text-slate-500 mt-1">
                Models may need to be trained or forecasts generated
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Simple bar chart visualization */}
            <div className="flex items-end justify-between h-64 gap-2 bg-slate-50 p-6 rounded-lg">
              {forecasts.map((point, idx) => {
                const maxValue = Math.max(...forecasts.map((d) => d.predicted_cases))
                const heightPercent = (point.predicted_cases / maxValue) * 100
                const date = new Date(point.forecast_date)
                const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full flex items-end justify-center h-32">
                      <div className="absolute inset-0 flex items-end justify-center">
                        <div
                          className="bg-gradient-to-t from-primary to-primary/50 rounded-t w-2/3"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold text-foreground z-10 mb-1">{point.predicted_cases}</div>
                    </div>
                    <span className="text-xs text-slate-600 truncate">{dayLabel}</span>
                  </div>
                )
              })}
            </div>

            {/* Statistics Table */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Statistics</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-600">Average</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(forecasts.reduce((sum, d) => sum + d.predicted_cases, 0) / forecasts.length)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-600">Peak</p>
                  <p className="text-2xl font-bold text-red-600">{Math.max(...forecasts.map((d) => d.predicted_cases))}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-600">Minimum</p>
                  <p className="text-2xl font-bold text-green-600">{Math.min(...forecasts.map((d) => d.predicted_cases))}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {forecasts.reduce((sum, d) => sum + d.predicted_cases, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Data Table */}
      {(forecasts.length > 0 || (customForecasts && customForecasts.forecasts)) && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {showCustomQuery && customForecasts ? 'Custom Query Results' : 'Daily Forecast Details'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Predicted Cases</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actual Cases</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Lower Bound</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Upper Bound</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Accuracy</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">MAE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(showCustomQuery && customForecasts ? customForecasts.forecasts : forecasts.map(f => ({
                  date: f.forecast_date,
                  predicted_cases: f.predicted_cases,
                  actual_cases: f.actual_cases,
                  lower_bound: f.confidence_interval?.lower || 0,
                  upper_bound: f.confidence_interval?.upper || f.predicted_cases * 2,
                  has_actual: f.actual_cases != null,
                  accuracy: f.actual_cases && f.actual_cases > 0
                    ? Math.max(0, 100 - Math.abs(f.predicted_cases - f.actual_cases) / f.actual_cases * 100)
                    : null,
                  mae: f.actual_cases != null ? Math.abs(f.predicted_cases - f.actual_cases) : null
                }))).map((point: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {typeof point.date === 'string' ? point.date : new Date(point.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{point.predicted_cases}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {point.actual_cases ?? 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {point.lower_bound ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {point.upper_bound ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {point.accuracy !== null && point.accuracy !== undefined ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          point.accuracy >= 80 
                            ? 'bg-emerald-100 text-emerald-800'
                            : point.accuracy >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {point.accuracy.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {point.mae !== null && point.mae !== undefined ? point.mae.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
