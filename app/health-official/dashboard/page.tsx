"use client"

import { ProtectedRoute } from "@/components/protected-route"
import HealthOfficialLayout from "@/components/health-official/layout"
import ForecastOverview from "@/components/health-official/forecast-overview"
import DiseaseForecasts from "@/components/health-official/disease-forecasts"
import RiskHeatmap from "@/components/health-official/risk-heatmap"
import ResourceEstimator from "@/components/health-official/resource-estimator"
import { useState } from "react"
import { TrendingUp, AlertTriangle, Layers, Wrench } from "lucide-react"

export default function HealthOfficialDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "forecasts", label: "Forecasts", icon: Layers },
    { id: "heatmap", label: "Risk Map", icon: AlertTriangle },
    { id: "resources", label: "Resources", icon: Wrench },
  ]

  return (
    <ProtectedRoute requiredRoles={["health_official"]}>
      <HealthOfficialLayout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Disease Surveillance Dashboard</h1>
              <p className="text-slate-600">Real-time forecasts and outbreak risk assessment for Lahore</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-1 py-4 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-600 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {activeTab === "overview" && <ForecastOverview />}
            {activeTab === "forecasts" && <DiseaseForecasts />}
            {activeTab === "heatmap" && <RiskHeatmap />}
            {activeTab === "resources" && <ResourceEstimator />}
          </div>
        </div>
      </HealthOfficialLayout>
    </ProtectedRoute>
  )
}
