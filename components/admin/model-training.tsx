"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { format, addDays, parseISO } from "date-fns"
import { api } from "@/lib/api"

interface DataRange {
  disease: string
  lab_test_start: string
  lab_test_end: string
  pharma_start: string
  pharma_end: string
  training_start: string
  training_end: string
}

interface TrainingSession {
  id: number
  disease: string
  training_start_date: string
  training_end_date: string
  forecast_start_date: string
  forecast_end_date: string
  status: string
  mae_score: number | null
  trained_at: string | null
  created_at: string
}

export function ModelTraining() {
  const [selectedDisease, setSelectedDisease] = useState<"MALARIA" | "DENGUE">("MALARIA")
  const [dataRange, setDataRange] = useState<DataRange | null>(null)
  const [trainingStart, setTrainingStart] = useState<Date>()
  const [trainingEnd, setTrainingEnd] = useState<Date>()
  const [forecastStart, setForecastStart] = useState<Date>()
  const [forecastEnd, setForecastEnd] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([])

  // Load data range when disease changes
  useEffect(() => {
    loadDataRange()
  }, [selectedDisease])

  // Load training sessions
  useEffect(() => {
    loadTrainingSessions()
  }, [])

  const loadDataRange = async () => {
    try {
      const response = await api.forecasting.getDataRange(selectedDisease)
      setDataRange(response)
      
      // Set default dates
      if (response.training_start && response.training_end) {
        setTrainingStart(parseISO(response.training_start))
        setTrainingEnd(parseISO(response.training_end))
        
        // Forecast starts the day after training ends
        const forecastStartDate = addDays(parseISO(response.training_end), 1)
        setForecastStart(forecastStartDate)
        setForecastEnd(addDays(forecastStartDate, 90)) // Default 90 days forecast
      }
    } catch (err) {
      console.error("Error loading data range:", err)
      setError("Failed to load available data range")
    }
  }

  const loadTrainingSessions = async () => {
    try {
      const response = await api.forecasting.listTrainingSessions()
      setTrainingSessions(response)
    } catch (err) {
      console.error("Error loading training sessions:", err)
    }
  }

  const validateDates = (): string | null => {
    if (!trainingStart || !trainingEnd || !forecastStart || !forecastEnd) {
      return "Please select all dates"
    }

    if (trainingStart >= trainingEnd) {
      return "Training start date must be before training end date"
    }

    if (forecastStart >= forecastEnd) {
      return "Forecast start date must be before forecast end date"
    }

    // Check if forecast starts immediately after training
    const expectedForecastStart = addDays(trainingEnd, 1)
    if (forecastStart.getTime() !== expectedForecastStart.getTime()) {
      return `Forecast must start immediately after training ends (${format(expectedForecastStart, "PPP")})`
    }

    // Validate against available data range
    if (dataRange) {
      const minDate = parseISO(dataRange.training_start)
      const maxDate = parseISO(dataRange.training_end)

      if (trainingStart < minDate || trainingEnd > maxDate) {
        return `Training dates must be within available range: ${format(minDate, "PPP")} to ${format(maxDate, "PPP")}`
      }
    }

    return null
  }

  const handleTrain = async () => {
    setError(null)
    setSuccess(null)

    const validationError = validateDates()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await api.forecasting.createTrainingSession({
        disease: selectedDisease,
        training_start_date: format(trainingStart!, "yyyy-MM-dd"),
        training_end_date: format(trainingEnd!, "yyyy-MM-dd"),
        forecast_start_date: format(forecastStart!, "yyyy-MM-dd"),
        forecast_end_date: format(forecastEnd!, "yyyy-MM-dd"),
      })

      setSuccess(`Training queued successfully! Session ID: ${response.id}`)
      loadTrainingSessions()
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to start training")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Model Training Configuration</h2>
          <p className="text-sm text-slate-600 mt-1">
            Configure and train disease forecasting models with custom date ranges
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Disease Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="MALARIA">Malaria</option>
              <option value="DENGUE">Dengue</option>
            </select>
          </div>

          {/* Available Data Range */}
          {dataRange && (
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h3 className="font-medium mb-2">Available Data Range</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Lab Test Data:</p>
                  <p className="font-mono">
                    {format(parseISO(dataRange.lab_test_start), "PPP")} to{" "}
                    {format(parseISO(dataRange.lab_test_end), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Pharmacy Data:</p>
                  <p className="font-mono">
                    {format(parseISO(dataRange.pharma_start), "PPP")} to{" "}
                    {format(parseISO(dataRange.pharma_end), "PPP")}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-slate-600">Valid Training Range:</p>
                  <p className="font-mono font-semibold text-green-600">
                    {format(parseISO(dataRange.training_start), "PPP")} to{" "}
                    {format(parseISO(dataRange.training_end), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Training Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Training Start Date</label>
              <input
                type="date"
                value={trainingStart ? format(trainingStart, "yyyy-MM-dd") : ""}
                onChange={(e) => setTrainingStart(e.target.value ? parseISO(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Training End Date</label>
              <input
                type="date"
                value={trainingEnd ? format(trainingEnd, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? parseISO(e.target.value) : undefined
                  setTrainingEnd(date)
                  if (date) {
                    setForecastStart(addDays(date, 1))
                  }
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Forecast Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Forecast Start Date</label>
              <input
                type="date"
                value={forecastStart ? format(forecastStart, "yyyy-MM-dd") : ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-slate-600">
                Automatically set to day after training end
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Forecast End Date</label>
              <input
                type="date"
                value={forecastEnd ? format(forecastEnd, "yyyy-MM-dd") : ""}
                onChange={(e) => setForecastEnd(e.target.value ? parseISO(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
              <p className="text-xs text-slate-600">
                Can extend beyond available data for future predictions
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Train Button */}
          <button
            onClick={handleTrain}
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Training Model...
              </>
            ) : (
              "Train Model"
            )}
          </button>
        </div>
      </div>

      {/* Training History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Training History</h2>
          <p className="text-sm text-slate-600 mt-1">Past training sessions and their status</p>
        </div>
        
        <div className="space-y-2">
          {trainingSessions.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-8">
              No training sessions yet
            </p>
          ) : (
            <div className="space-y-2">
              {trainingSessions.slice(0, 10).map((session) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "COMPLETED":
                      return "bg-green-100 text-green-700"
                    case "PENDING":
                      return "bg-yellow-100 text-yellow-700"
                    case "TRAINING":
                      return "bg-blue-100 text-blue-700"
                    case "FAILED":
                      return "bg-red-100 text-red-700"
                    default:
                      return "bg-slate-100 text-slate-700"
                  }
                }

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.disease}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Training: {format(parseISO(session.training_start_date), "PP")} →{" "}
                        {format(parseISO(session.training_end_date), "PP")}
                      </div>
                      <div className="text-sm text-slate-600">
                        Forecast: {format(parseISO(session.forecast_start_date), "PP")} →{" "}
                        {format(parseISO(session.forecast_end_date), "PP")}
                      </div>
                    </div>
                    <div className="text-right">
                      {session.mae_score && (
                        <div className="text-sm font-medium">MAE: {session.mae_score.toFixed(2)}</div>
                      )}
                      <div className="text-xs text-slate-600">
                        {session.trained_at
                          ? format(parseISO(session.trained_at), "PPp")
                          : format(parseISO(session.created_at), "PPp")}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
