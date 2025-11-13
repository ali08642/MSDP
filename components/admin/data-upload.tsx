"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react"

export default function DataUploadModule() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [dataType, setDataType] = useState("lab")
  const [file, setFile] = useState<File | null>(null)

  const dataTypes = [
    { id: "lab", label: "Laboratory Data", description: "Daily confirmed COVID/Dengue/Malaria cases" },
    { id: "pharmacy", label: "Pharmacy Sales", description: "Daily drug sales by category" },
    { id: "weather", label: "Weather Data", description: "Temperature, humidity, rainfall" },
    { id: "search", label: "Search Trends", description: "Google Trends queries" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploadStatus("uploading")

    setTimeout(() => {
      setUploadStatus("success")
      setFile(null)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Files must be in CSV or XLSX format</li>
          <li>• Dates should be in YYYY-MM-DD format</li>
          <li>• Daily aggregation is required (one row per day)</li>
          <li>• No PII should be included in uploads</li>
        </ul>
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
          <p className="text-slate-600 mb-4">Drag and drop your file here, or click to browse</p>
          <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="inline-block">
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Choose File
            </button>
          </label>
          {file && (
            <p className="text-sm text-slate-600 mt-4">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Upload Status & Button */}
      <div className="space-y-4">
        {uploadStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Upload successful</p>
              <p className="text-sm text-green-800">Data has been validated and queued for processing</p>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Upload failed</p>
              <p className="text-sm text-red-800">Please check the file format and try again</p>
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
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">File Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Uploaded</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { name: "lab-cases-nov.csv", type: "Laboratory", date: "2025-01-10", status: "Processed" },
                { name: "pharmacy-sales.xlsx", type: "Pharmacy", date: "2025-01-10", status: "Processing" },
                { name: "weather-data.csv", type: "Weather", date: "2025-01-09", status: "Processed" },
              ].map((upload, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-foreground">{upload.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{upload.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{upload.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        upload.status === "Processed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {upload.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
