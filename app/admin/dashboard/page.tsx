"use client"

import { ProtectedRoute } from "@/components/protected-route"
import AdminLayout from "@/components/admin/layout"
import DataUploadModule from "@/components/admin/data-upload"
import ModelManagement from "@/components/admin/model-management"
import { ModelTraining } from "@/components/admin/model-training"
import UserManagement from "@/components/admin/user-management"
import SystemMonitoring from "@/components/admin/system-monitoring"
import { useState } from "react"
import { UploadCloud, Settings, Users, Activity, Brain } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "upload", label: "Data Upload", icon: UploadCloud },
    { id: "training", label: "Model Training", icon: Brain },
    { id: "models", label: "Models", icon: Settings },
    { id: "users", label: "Users", icon: Users },
  ]

  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Manage datasets, models, and system configuration</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 bg-white">
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
            {activeTab === "overview" && <SystemMonitoring />}
            {activeTab === "upload" && <DataUploadModule />}
            {activeTab === "training" && <ModelTraining />}
            {activeTab === "models" && <ModelManagement />}
            {activeTab === "users" && <UserManagement />}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
