"use client"

import { ProtectedRoute } from "@/components/protected-route"
import PharmacyLayout from "@/components/pharmacy/layout"
import PharmacyPOSInterface from "@/components/pharmacy/pos-interface"

export default function PharmacyDataEntry() {
  return (
    <ProtectedRoute requiredRoles={["PHARMACIST"]}>
      <PharmacyLayout>
        <PharmacyPOSInterface />
      </PharmacyLayout>
    </ProtectedRoute>
  )
}
