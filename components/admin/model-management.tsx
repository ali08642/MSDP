"use client"

import { Play, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function ModelManagement() {
  const [trainingModel, setTrainingModel] = useState<string | null>(null)

  const models = [
    { id: "lstm", name: "LSTM Network", disease: "All Diseases", accuracy: 0.87, lastTrained: "2025-01-10" },
    { id: "arimax", name: "ARIMAX", disease: "All Diseases", accuracy: 0.79, lastTrained: "2025-01-10" },
    { id: "xgboost", name: "XGBoost", disease: "All Diseases", accuracy: 0.84, lastTrained: "2025-01-09" },
  ]

  const handleRetrain = (modelId: string) => {
    setTrainingModel(modelId)
    setTimeout(() => setTrainingModel(null), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Model Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-2">Active Models</p>
          <p className="text-3xl font-bold text-foreground">{models.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-2">Avg Accuracy</p>
          <p className="text-3xl font-bold text-foreground">
            {((models.reduce((sum, m) => sum + m.accuracy, 0) / models.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-2">Last Updated</p>
          <p className="text-lg font-bold text-foreground">Today</p>
        </div>
      </div>

      {/* Models Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Forecasting Models</h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Model</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Accuracy</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Last Trained</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{model.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{model.disease}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${model.accuracy * 100}%` }} />
                      </div>
                      <span className="font-semibold text-foreground">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{model.lastTrained}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleRetrain(model.id)}
                      disabled={trainingModel === model.id}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors disabled:opacity-50 text-xs font-medium"
                    >
                      {trainingModel === model.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Retrain
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Performance Chart */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h2>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">RMSE by Disease</p>
              <div className="space-y-4">
                {["COVID-19", "Dengue", "Malaria", "Pneumonia", "Diarrhea"].map((disease) => (
                  <div key={disease} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{disease}</span>
                    <span className="font-semibold text-foreground">{Math.floor(Math.random() * 15) + 5}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">F1-Score by Disease</p>
              <div className="space-y-4">
                {["COVID-19", "Dengue", "Malaria", "Pneumonia", "Diarrhea"].map((disease) => (
                  <div key={disease} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{disease}</span>
                    <span className="font-semibold text-foreground">{(Math.random() * 0.3 + 0.7).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
