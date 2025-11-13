"use client"

import { ProtectedRoute } from "@/components/protected-route"
import LabLayout from "@/components/lab/layout"
import LabDataForm from "@/components/lab/data-form"

export default function LabDataEntry() {
  return (
    <ProtectedRoute requiredRoles={["lab_technician"]}>
      <LabLayout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Lab Test Results Entry</h1>
              <p className="text-slate-600">Record daily test results for disease surveillance</p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <LabDataForm />
          </div>
        </div>
      </LabLayout>
    </ProtectedRoute>
  )
}
