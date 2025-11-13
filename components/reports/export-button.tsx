"use client"

import { Download } from "lucide-react"
import { useState } from "react"

interface ExportButtonProps {
  data: any
  filename: string
  format?: "pdf" | "csv" | "excel"
}

export function ExportButton({ data, filename, format = "pdf" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)

    try {
      // Simulate export generation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create blob based on format
      let blob: Blob
      if (format === "csv") {
        const csv = convertToCSV(data)
        blob = new Blob([csv], { type: "text/csv" })
      } else if (format === "excel") {
        const csv = convertToCSV(data)
        blob = new Blob([csv], { type: "application/vnd.ms-excel" })
      } else {
        // For PDF, we'd typically use a library like jsPDF
        blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/pdf" })
      }

      // Download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } finally {
      setLoading(false)
    }
  }

  const convertToCSV = (obj: any): string => {
    if (Array.isArray(obj)) {
      const headers = Object.keys(obj[0])
      const rows = obj.map((item: any) => headers.map((header) => JSON.stringify(item[header])).join(","))
      return [headers.join(","), ...rows].join("\n")
    }
    return JSON.stringify(obj)
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
    >
      <Download className="w-4 h-4" />
      {loading ? "Exporting..." : `Export (${format.toUpperCase()})`}
    </button>
  )
}
