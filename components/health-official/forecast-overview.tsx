"use client"

import { AlertTriangle, TrendingUp, Activity, AlertCircle } from "lucide-react"

export default function ForecastOverview() {
  const diseases = [
    { name: "Dengue", forecast: 245, trend: "+12%", risk: "high", cases: "1,234 active" },
    { name: "Malaria", forecast: 89, trend: "+5%", risk: "medium", cases: "456 active" },
    { name: "COVID-19", forecast: 34, trend: "-3%", risk: "low", cases: "89 active" },
    { name: "Pneumonia", forecast: 156, forecast: 156, trend: "+8%", risk: "high", cases: "567 active" },
    { name: "Diarrhea", forecast: 267, trend: "+15%", risk: "high", cases: "892 active" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Total Forecasted Cases</p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">1,021</p>
          <p className="text-xs text-slate-500 mt-2">Next 7 days</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">High Risk Diseases</p>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-xs text-slate-500 mt-2">Dengue, Pneumonia, Diarrhea</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Avg Confidence</p>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">87.3%</p>
          <p className="text-xs text-slate-500 mt-2">Model accuracy</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Last Updated</p>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-foreground">Today</p>
          <p className="text-xs text-slate-500 mt-2">6:30 AM</p>
        </div>
      </div>

      {/* Disease Forecasts Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">7-Day Forecasts by Disease</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {diseases.map((disease, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{disease.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{disease.cases}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(disease.risk)}`}>
                  {disease.risk.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-sm text-slate-600">Forecasted Cases</p>
                    <p className={`font-bold ${disease.trend.startsWith("+") ? "text-red-600" : "text-green-600"}`}>
                      {disease.forecast} {disease.trend}
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        disease.risk === "high"
                          ? "bg-red-500"
                          : disease.risk === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min((disease.forecast / 300) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Model</p>
                    <p className="font-medium text-foreground">LSTM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="font-medium text-foreground">{Math.floor(Math.random() * 20) + 80}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Horizon</p>
                    <p className="font-medium text-foreground">7 days</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Action Recommendations</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Increase dengue vector control measures in high-risk zones</li>
          <li>• Pre-position respiratory supplies for pneumonia surge</li>
          <li>• Prepare ORS and fluid management protocols for diarrhea outbreak</li>
          <li>• Coordinate with pharmacies for medicine availability</li>
        </ul>
      </div>
    </div>
  )
}
