"use client"

import { ProtectedRoute } from "@/components/protected-route"
import PharmacyLayout from "@/components/pharmacy/layout"
import PharmacyDataForm from "@/components/pharmacy/data-form"
import PharmacyHistory from "@/components/pharmacy/history"
import { useState } from "react"
import { Plus, History } from "lucide-react"

export default function PharmacyDataEntry() {
  const [activeTab, setActiveTab] = useState("new")

  return (
    <ProtectedRoute requiredRoles={["pharmacist"]}>
      <PharmacyLayout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Data Entry</h1>
              <p className="text-slate-600">Record daily medicine sales for disease surveillance</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("new")}
                  className={`px-1 py-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === "new"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-600 hover:text-foreground"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  New Entry
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-1 py-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === "history"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-600 hover:text-foreground"
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {activeTab === "new" && <PharmacyDataForm />}
            {activeTab === "history" && <PharmacyHistory />}
          </div>
        </div>
      </PharmacyLayout>
    </ProtectedRoute>
  )
}
