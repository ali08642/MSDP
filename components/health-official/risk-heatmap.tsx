"use client"

export default function RiskHeatmap() {
  const zones = [
    { name: "North Lahore", dengue: "high", malaria: "medium", covid: "low", pneumonia: "high", diarrhea: "medium" },
    { name: "Central Lahore", dengue: "medium", malaria: "high", covid: "low", pneumonia: "medium", diarrhea: "high" },
    { name: "South Lahore", dengue: "high", malaria: "low", covid: "medium", pneumonia: "high", diarrhea: "medium" },
    { name: "East Lahore", dengue: "medium", malaria: "medium", covid: "low", pneumonia: "medium", diarrhea: "low" },
    { name: "West Lahore", dengue: "high", malaria: "high", covid: "medium", pneumonia: "high", diarrhea: "high" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-slate-300"
    }
  }

  return (
    <div className="space-y-8">
      {/* Risk Matrix */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Regional Risk Assessment</h2>
        <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Region</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Dengue</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Malaria</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">COVID-19</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Pneumonia</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Diarrhea</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Overall Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {zones.map((zone, idx) => {
                const riskLevels = [zone.dengue, zone.malaria, zone.covid, zone.pneumonia, zone.diarrhea]
                const highCount = riskLevels.filter((r) => r === "high").length
                const overallRisk = highCount >= 3 ? "high" : highCount >= 1 ? "medium" : "low"

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-foreground">{zone.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-4 h-4 rounded ${getRiskColor(zone.dengue)}`} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-4 h-4 rounded ${getRiskColor(zone.malaria)}`} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-4 h-4 rounded ${getRiskColor(zone.covid)}`} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-4 h-4 rounded ${getRiskColor(zone.pneumonia)}`} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-4 h-4 rounded ${getRiskColor(zone.diarrhea)}`} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          overallRisk === "high"
                            ? "bg-red-100 text-red-800"
                            : overallRisk === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {overallRisk.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-foreground mb-4">Risk Level Guide</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-green-500 rounded mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Low Risk</p>
              <p className="text-sm text-slate-600">Predicted cases below baseline + 1σ</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Medium Risk</p>
              <p className="text-sm text-slate-600">Predicted cases between +1σ and +2σ</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-red-500 rounded mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">High Risk</p>
              <p className="text-sm text-slate-600">Predicted cases above baseline + 2σ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
