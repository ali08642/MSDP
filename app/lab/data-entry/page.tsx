"use client"

import { ProtectedRoute } from "@/components/protected-route"
import LabLayout from "@/components/lab/layout"
import LabEntrySystem from "@/components/lab/entry-system"

export default function LabDataEntry() {
  return (
    <ProtectedRoute requiredRoles={["lab_technician"]}>
      <LabLayout>
        <LabEntrySystem />
      </LabLayout>
    </ProtectedRoute>
  )
}
