"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

const MEDICINES = {
  malaria: ["Basoquin", "Amdaquin", "Amoquine", "Fansidar", "Coartem"],
  dengue: ["Panadol", "Calpol", "Febrol", "Vitamin C", "Folic Acid"],
  covid: ["Panadol", "Calpol", "Disprol", "Vitamin C", "Medisol"],
  pneumonia: ["Medilact-D", "Plasaline", "Hartmann", "Dextrone", "Flagyl"],
  diarrhea: ["Pedialyte", "ORS-L", "Hydral", "Zincolak", "Enterogermina"],
}

export default function PharmacyDataForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    malaria: {},
    dengue: {},
    covid: {},
    pneumonia: {},
    diarrhea: {},
  })

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [loading, setLoading] = useState(false)

  const handleMedicineChange = (disease: keyof typeof MEDICINES, medicine: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [disease]: {
        ...prev[disease as keyof typeof formData],
        [medicine]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus("success")
      setTimeout(() => setStatus("idle"), 3000)

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        malaria: {},
        dengue: {},
        covid: {},
        pneumonia: {},
        diarrhea: {},
      })
    } catch (error) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use This Form</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select the date for which you're entering data</li>
          <li>• Enter units sold for each medicine today</li>
          <li>• Leave blank if not sold</li>
          <li>• Submit once daily (all medicines in one entry)</li>
        </ul>
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Data submitted successfully</p>
            <p className="text-sm text-green-800">Your pharmacy data has been recorded</p>
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
          <p className="text-xs text-slate-500 mt-1">Data for this date</p>
        </div>

        {/* Disease Sections */}
        {Object.entries(MEDICINES).map(([disease, medicines]) => (
          <div key={disease} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-foreground mb-4 capitalize">{disease.toUpperCase()} Medicines</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {medicines.map((medicine) => (
                <div key={medicine}>
                  <label className="block text-sm font-medium text-foreground mb-2">{medicine}</label>
                  <input
                    type="number"
                    min="0"
                    value={(formData[disease as keyof typeof MEDICINES] as Record<string, string>)[medicine] || ""}
                    onChange={(e) => handleMedicineChange(disease as keyof typeof MEDICINES, medicine, e.target.value)}
                    placeholder="Units sold"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
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
            {loading ? "Submitting..." : "Submit Daily Data"}
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
