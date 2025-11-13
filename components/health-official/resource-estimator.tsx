"use client"

import { useState } from "react"
import { Bed, Users, Pill } from "lucide-react"

export default function ResourceEstimator() {
  const [selectedDisease, setSelectedDisease] = useState("dengue")
  const [horizon, setHorizon] = useState("7")
  const [occupancyRate, setOccupancyRate] = useState(0.75)

  const diseases = [
    { id: "dengue", name: "Dengue", bedsPerCase: 0.3, staffPerBeds: 0.5, suppliesPerCase: 150 },
    { id: "malaria", name: "Malaria", bedsPerCase: 0.25, staffPerBeds: 0.4, suppliesPerCase: 120 },
    { id: "covid19", name: "COVID-19", bedsPerCase: 0.4, staffPerBeds: 0.6, suppliesPerCase: 200 },
    { id: "pneumonia", name: "Pneumonia", bedsPerCase: 0.35, staffPerBeds: 0.55, suppliesPerCase: 180 },
    { id: "diarrhea", name: "Diarrhea", bedsPerCase: 0.15, staffPerBeds: 0.2, suppliesPerCase: 80 },
  ]

  const disease = diseases.find((d) => d.id === selectedDisease)!
  const forecastedCases = Math.floor(Math.random() * 300) + 100
  const requiredBeds = Math.ceil((forecastedCases * disease.bedsPerCase) / occupancyRate)
  const requiredStaff = Math.ceil(requiredBeds * disease.staffPerBeds)
  const requiredSupplies = forecastedCases * disease.suppliesPerCase

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {diseases.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
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
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Occupancy Rate</label>
            <select
              value={occupancyRate}
              onChange={(e) => setOccupancyRate(Number.parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value={0.5}>50%</option>
              <option value={0.6}>60%</option>
              <option value={0.75}>75%</option>
              <option value={0.85}>85%</option>
              <option value={0.95}>95%</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Forecasted Cases</label>
            <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
              <p className="font-semibold text-foreground">{forecastedCases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Requirements */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-blue-900">Hospital Beds Required</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{requiredBeds}</p>
              <p className="text-xs text-blue-800 mt-2">At {(occupancyRate * 100).toFixed(0)}% occupancy</p>
            </div>
            <Bed className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-emerald-900">Staff Required</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{requiredStaff}</p>
              <p className="text-xs text-emerald-800 mt-2">Nurses & Technicians</p>
            </div>
            <Users className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-purple-900">Supplies Needed</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{requiredSupplies.toLocaleString()}</p>
              <p className="text-xs text-purple-800 mt-2">Units (medicines, PPE, etc)</p>
            </div>
            <Pill className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Detailed Requirements Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-foreground">Itemized Resources</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Resource Type</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Current</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Required</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Shortage</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              { type: "ICU Beds", current: 15, required: 8 },
              { type: "General Beds", current: 45, required: requiredBeds - 8 },
              { type: "Nurses", current: 32, required: requiredStaff * 0.7 },
              { type: "Technicians", current: 18, required: requiredStaff * 0.3 },
              { type: "Medications (units)", current: 5000, required: Math.ceil(requiredSupplies * 0.4) },
              { type: "IV Fluids (liters)", current: 2000, required: Math.ceil(requiredSupplies * 0.3) },
              { type: "PPE Sets", current: 3000, required: Math.ceil(requiredSupplies * 0.2) },
            ].map((item, idx) => {
              const shortage = Math.max(0, item.required - item.current)
              const status = shortage > 0 ? "warning" : "sufficient"

              return (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{item.type}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-600">{item.current}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                    {Math.ceil(item.required)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <span className={shortage > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                      {shortage > 0 ? `+${shortage}` : "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {status === "warning" ? "Action Required" : "Sufficient"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Export */}
      <div className="flex gap-4">
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Export Report
        </button>
        <button className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          Save Scenario
        </button>
      </div>
    </div>
  )
}
