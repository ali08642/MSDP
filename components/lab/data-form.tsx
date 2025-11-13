"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function LabDataForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    covid_positive: 0,
    covid_negative: 0,
    dengue_positive: 0,
    dengue_negative: 0,
    malaria_positive: 0,
    malaria_negative: 0,
    pneumonia_positive: 0,
    pneumonia_negative: 0,
    diarrhea_positive: 0,
    diarrhea_negative: 0,
  })

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Number.parseInt(value) || 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus("success")
      setTimeout(() => setStatus("idle"), 3000)

      setFormData({
        date: new Date().toISOString().split("T")[0],
        covid_positive: 0,
        covid_negative: 0,
        dengue_positive: 0,
        dengue_negative: 0,
        malaria_positive: 0,
        malaria_negative: 0,
        pneumonia_positive: 0,
        pneumonia_negative: 0,
        diarrhea_positive: 0,
        diarrhea_negative: 0,
      })
    } catch (error) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const diseases = [
    { id: "covid", name: "COVID-19" },
    { id: "dengue", name: "Dengue" },
    { id: "malaria", name: "Malaria" },
    { id: "pneumonia", name: "Pneumonia" },
    { id: "diarrhea", name: "Diarrhea" },
  ]

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Test Entry Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter total positive and negative test results for today</li>
          <li>• Include all tests conducted at your laboratory</li>
          <li>• Ensure data is accurate before submission</li>
          <li>• Submit once daily with consolidated results</li>
        </ul>
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Test results submitted successfully</p>
            <p className="text-sm text-green-800">Your lab data has been recorded</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Submission failed</p>
            <p className="text-sm text-red-800">Please try again</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date Input */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Tests conducted on this date</p>
        </div>

        {/* Disease Results */}
        {diseases.map((disease) => (
          <div key={disease.id} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-foreground mb-6">{disease.name} Test Results</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Positive Results</label>
                <input
                  type="number"
                  min="0"
                  value={formData[`${disease.id}_positive` as keyof typeof formData]}
                  onChange={(e) => handleChange(`${disease.id}_positive`, e.target.value)}
                  placeholder="Number of positive tests"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Negative Results</label>
                <input
                  type="number"
                  min="0"
                  value={formData[`${disease.id}_negative` as keyof typeof formData]}
                  onChange={(e) => handleChange(`${disease.id}_negative`, e.target.value)}
                  placeholder="Number of negative tests"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Submitting..." : "Submit Test Results"}
          </button>
          <button
            type="button"
            className="border border-slate-300 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}
