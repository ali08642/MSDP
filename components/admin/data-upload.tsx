"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { api } from "@/lib/api"

export default function DataUploadModule() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [dataType, setDataType] = useState("lab")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadHistory, setUploadHistory] = useState<any[]>([])
  const [disease, setDisease] = useState<"MALARIA" | "DENGUE" | "DIARRHOEA">("MALARIA")

  const dataTypes = [
    { 
      id: "lab", 
      label: "Laboratory Test Data", 
      description: "CSV with: date, positive_tests, total_tests",
      requiredColumns: ["date", "positive_tests", "total_tests"]
    },
    { 
      id: "pharmacy", 
      label: "Pharmacy Sales Data", 
      description: "CSV with: date, brand_name, total_sales",
      requiredColumns: ["date", "brand_name", "total_sales"]
    },
  ]

  // Load upload history on mount
  useEffect(() => {
    loadUploadHistory()
  }, [])

  const loadUploadHistory = async () => {
    try {
      const datasets = await api.datasets.list()
      // Ensure we always have an array
      setUploadHistory(Array.isArray(datasets) ? datasets : [])
    } catch (err) {
      console.error("Error loading upload history:", err)
      setUploadHistory([]) // Set empty array on error
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploadStatus("uploading")
    setError(null)

    try {
      const metadata = {
        dataset_type: dataType.toUpperCase(),
        disease: disease,
        name: file.name,
      }

      const response = await api.datasets.upload(file, metadata)
      
      // Dataset uploaded, now poll for validation completion
      const datasetId = response?.id
      
      if (!datasetId) {
        console.warn("⚠️ Dataset uploaded but no ID returned, skipping polling")
        setUploadStatus("success")
        setFile(null)
        await loadUploadHistory()
        setTimeout(() => setUploadStatus("idle"), 5000)
        return
      }
      
      console.log(`📤 Dataset uploaded (ID: ${datasetId}), validating in background...`)
      
      setUploadStatus("success")
      setFile(null)
      
      // Poll for validation status (check every 2 seconds, max 60 seconds)
      let attempts = 0
      const maxAttempts = 30
      
      const pollStatus = async () => {
        try {
          const response = await api.datasets.list()
          // Handle both array and object responses
          const datasets = Array.isArray(response) ? response : (response.results || [])
          const dataset = datasets.find((d: any) => d.id === datasetId)
          
          if (!dataset) {
            console.error("Dataset not found")
            return
          }
          
          console.log(`📊 Validation status: ${dataset.status}`)
          
          if (dataset.status === 'PROCESSED') {
            console.log("✅ Dataset validated successfully!")
            await loadUploadHistory()
            return
          } else if (dataset.status === 'INVALID') {
            console.error("❌ Validation failed:", dataset.validation_errors)
            setError(JSON.stringify(dataset.validation_errors))
            setUploadStatus("error")
            return
          }
          
          // Still validating, check again
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(pollStatus, 2000)
          } else {
            console.log("⏱️ Validation taking longer than expected, check dataset list")
            await loadUploadHistory()
          }
        } catch (pollError) {
          console.error("Polling error:", pollError)
        }
      }
      
      // Start polling after 1 second
      setTimeout(pollStatus, 1000)
      
      // Show success message with instructions
      console.log("📊 Go to Model Training tab and click 'Refresh' after validation completes")
      
      // Reset after 5 seconds (longer to give user time to read the message)
      setTimeout(() => {
        setUploadStatus("idle")
      }, 5000)
    } catch (err: any) {
      setUploadStatus("error")
      setError(err.message || "Upload failed. Please check the file format and try again.")
      
      setTimeout(() => {
        setUploadStatus("idle")
      }, 5000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Files must be in CSV format</li>
          <li>• Date format: DD/MM/YYYY or YYYY-MM-DD</li>
          <li>• Lab tests: columns must be "date, positive_tests, total_tests"</li>
          <li>• Pharmacy: columns must be "date, brand_name, total_sales"</li>
          <li>• No header modifications - use exact column names</li>
        </ul>
      </div>

      {/* Disease Selection */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Select Disease</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setDisease("MALARIA")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              disease === "MALARIA" 
                ? "bg-primary text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Malaria
          </button>
          <button
            onClick={() => setDisease("DENGUE")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              disease === "DENGUE" 
                ? "bg-primary text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Dengue
          </button>
          <button
            onClick={() => setDisease("DIARRHOEA")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              disease === "DIARRHOEA" 
                ? "bg-primary text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Diarrhoea
          </button>
        </div>
      </div>

      {/* Data Type Selection */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Select Data Type</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dataTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setDataType(type.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                dataType === type.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <h3 className="font-semibold text-foreground">{type.label}</h3>
              <p className="text-sm text-slate-600 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Upload File</h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
          <p className="text-sm text-slate-500 mb-4">
            {dataType === "lab" 
              ? "Expected: date, positive_tests, total_tests" 
              : "Expected: date, brand_name, total_sales"}
          </p>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="hidden" 
            id="file-input"
            disabled={uploadStatus === "uploading"}
          />
          <label htmlFor="file-input" className="inline-block">
            <span className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-block">
              Choose File
            </span>
          </label>
          {file && (
            <p className="text-sm text-slate-600 mt-4">
              Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Upload Status & Button */}
      <div className="space-y-4">
        {uploadStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">Upload successful!</p>
              <p className="text-sm text-green-800">Data has been validated and imported.</p>
              <p className="text-xs text-green-700 mt-2 font-medium">
                💡 Go to <span className="underline">Model Training</span> tab and click <span className="font-bold">Refresh</span> to see updated data ranges
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Upload failed</p>
              <p className="text-sm text-red-800">{error || "Please check the file format and try again"}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploadStatus === "uploading"}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploadStatus === "uploading" && <Loader className="w-4 h-4 animate-spin" />}
          {uploadStatus === "uploading" ? "Uploading..." : "Upload Data"}
        </button>
      </div>

      {/* Upload History */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {uploadHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No uploads yet. Upload your first dataset above.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">File Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Disease</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Uploaded</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Array.isArray(uploadHistory) && uploadHistory.slice(0, 10).map((upload, idx) => (
                  <tr key={upload.id || idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-foreground">{upload.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{upload.dataset_type?.toLowerCase() || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{upload.disease || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {upload.uploaded_at ? new Date(upload.uploaded_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          upload.status === "VALIDATED" 
                            ? "bg-green-100 text-green-800" 
                            : upload.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {upload.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
