"use client"

import { useState } from "react"
import { DownloadCloud } from "lucide-react"

export default function DiseaseForecasts() {
  const [selectedDisease, setSelectedDisease] = useState("dengue")
  const [horizon, setHorizon] = useState("7")

  const diseases = ["dengue", "malaria", "covid19", "pneumonia", "diarrhea"]
  const diseaseNames: Record<string, string> = {
    dengue: "Dengue",
    malaria: "Malaria",
    covid19: "COVID-19",
    pneumonia: "Pneumonia",
    diarrhea: "Diarrhea",
  }

  // Simulated forecast data
  const generateForecastData = () => {
    const days = Number.parseInt(horizon)
    const data = []
    let baseValue = Math.floor(Math.random() * 100) + 50

    for (let i = 0; i < days; i++) {
      baseValue += Math.floor(Math.random() * 20) - 5
      data.push({
        day: `Day ${i + 1}`,
        predicted: baseValue,
        lower: Math.max(0, baseValue - 15),
        upper: baseValue + 15,
      })
    }
    return data
  }

  const forecastData = generateForecastData()

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          <div>
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2">
              <DownloadCloud className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          {diseaseNames[selectedDisease]} Forecast ({horizon}-Day)
        </h2>

        <div className="space-y-6">
          {/* Simple bar chart visualization */}
          <div className="flex items-end justify-between h-64 gap-2 bg-slate-50 p-6 rounded-lg">
            {forecastData.map((point, idx) => {
              const maxValue = Math.max(...forecastData.map((d) => d.upper))
              const heightPercent = (point.predicted / maxValue) * 100

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end justify-center h-32">
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div
                        className="bg-gradient-to-t from-primary to-primary/50 rounded-t w-2/3"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold text-foreground z-10 mb-1">{point.predicted}</div>
                  </div>
                  <span className="text-xs text-slate-600 truncate">{point.day}</span>
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
                  {Math.round(forecastData.reduce((sum, d) => sum + d.predicted, 0) / forecastData.length)}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-600">Peak</p>
                <p className="text-2xl font-bold text-red-600">{Math.max(...forecastData.map((d) => d.predicted))}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-600">Minimum</p>
                <p className="text-2xl font-bold text-green-600">{Math.min(...forecastData.map((d) => d.predicted))}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-600">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {forecastData.reduce((sum, d) => sum + d.predicted, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-foreground">Daily Forecast Details</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Day</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Predicted Cases</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Lower Bound</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Upper Bound</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {forecastData.map((point, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{point.day}</td>
                <td className="px-6 py-4 text-sm text-foreground font-semibold">{point.predicted}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{point.lower}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{point.upper}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                    {Math.floor(Math.random() * 15) + 80}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
