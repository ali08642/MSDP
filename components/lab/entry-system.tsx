"use client"
import { useState } from "react"
import { CheckCircle, AlertCircle, Clock, Beaker, Plus, Trash2, Eye } from "lucide-react"

interface TestBatch {
  id: string
  date: string
  time: string
  disease: string
  positive: number
  negative: number
  total: number
  verified: boolean
}

interface PatientTest {
  id: string
  patientId: string
  patientName: string
  disease: string
  testType: string
  result: "positive" | "negative" | "pending"
  notes: string
  timestamp: string
}

const DISEASES = [
  { id: "covid", name: "COVID-19" },
  { id: "dengue", name: "Dengue Fever" },
  { id: "malaria", name: "Malaria" },
  { id: "pneumonia", name: "Pneumonia" },
  { id: "diarrhea", name: "Diarrhea" },
]

const TEST_TYPES = {
  covid: ["RT-PCR", "Antigen", "Antibody"],
  dengue: ["NS1", "IgM", "IgG", "PCR"],
  malaria: ["Blood Smear", "RDT", "PCR"],
  pneumonia: ["Chest X-ray", "Sputum Culture", "PCR"],
  diarrhea: ["Stool Culture", "Stool Antigen", "Microscopy"],
}

export default function LabEntrySystem() {
  const [view, setView] = useState<"batch" | "individual" | "history">("batch")
  const [batchData, setBatchData] = useState({
    date: new Date().toISOString().split("T")[0],
    disease: "covid",
    positive: "",
    negative: "",
  })

  const [individualTest, setIndividualTest] = useState({
    patientId: "",
    patientName: "",
    disease: "covid",
    testType: "RT-PCR",
    result: "pending" as const,
    notes: "",
  })

  const [batches, setBatches] = useState<TestBatch[]>([])
  const [tests, setTests] = useState<PatientTest[]>([])
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [selectedBatch, setSelectedBatch] = useState<TestBatch | null>(null)

  const validateBatchData = () => {
    if (!batchData.positive || !batchData.negative) {
      setError("Please enter both positive and negative test counts")
      return false
    }

    const pos = Number.parseInt(batchData.positive)
    const neg = Number.parseInt(batchData.negative)

    if (pos < 0 || neg < 0) {
      setError("Test counts cannot be negative")
      return false
    }

    if (pos + neg === 0) {
      setError("At least one test must be recorded")
      return false
    }

    return true
  }

  const submitBatch = async () => {
    setError("")
    if (!validateBatchData()) return

    try {
      const batch: TestBatch = {
        id: `BATCH-${Date.now()}`,
        date: batchData.date,
        time: new Date().toLocaleTimeString(),
        disease: DISEASES.find((d) => d.id === batchData.disease)?.name || batchData.disease,
        positive: Number.parseInt(batchData.positive),
        negative: Number.parseInt(batchData.negative),
        total: Number.parseInt(batchData.positive) + Number.parseInt(batchData.negative),
        verified: false,
      }

      setBatches([batch, ...batches])
      setBatchData({
        date: new Date().toISOString().split("T")[0],
        disease: "covid",
        positive: "",
        negative: "",
      })

      setSuccess(`Batch ${batch.id} submitted successfully. Total tests: ${batch.total}`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to submit batch. Please try again.")
    }
  }

  const submitIndividualTest = async () => {
    setError("")

    if (!individualTest.patientId || !individualTest.patientName) {
      setError("Please enter patient ID and name")
      return
    }

    try {
      const test: PatientTest = {
        id: `TEST-${Date.now()}`,
        patientId: individualTest.patientId,
        patientName: individualTest.patientName,
        disease: DISEASES.find((d) => d.id === individualTest.disease)?.name || individualTest.disease,
        testType: individualTest.testType,
        result: individualTest.result,
        notes: individualTest.notes,
        timestamp: new Date().toLocaleString(),
      }

      setTests([test, ...tests])
      setIndividualTest({
        patientId: "",
        patientName: "",
        disease: "covid",
        testType: "RT-PCR",
        result: "pending",
        notes: "",
      })

      setSuccess(`Test ${test.id} recorded successfully`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to record test. Please try again.")
    }
  }

  const verifyBatch = (batchId: string) => {
    setBatches(batches.map((b) => (b.id === batchId ? { ...b, verified: true } : b)))
    setSuccess("Batch verified successfully")
    setTimeout(() => setSuccess(""), 3000)
  }

  const deleteBatch = (batchId: string) => {
    setBatches(batches.filter((b) => b.id !== batchId))
  }

  const deleteTest = (testId: string) => {
    setTests(tests.filter((t) => t.id !== testId))
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Laboratory Entry System</h1>
            <p className="text-blue-100">MSDP - Test Results Management</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Lab ID: LAB-001</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex">
          {[
            { id: "batch", label: "Batch Entry", icon: Beaker },
            { id: "individual", label: "Individual Test", icon: Plus },
            { id: "history", label: "History", icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id as typeof view)}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                view === id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {view === "batch" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entry Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Daily Batch Entry</h2>

                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Test Date</label>
                    <input
                      type="date"
                      value={batchData.date}
                      onChange={(e) => setBatchData({ ...batchData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Disease Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Disease</label>
                    <select
                      value={batchData.disease}
                      onChange={(e) => setBatchData({ ...batchData, disease: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {DISEASES.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Results Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Positive Results</label>
                      <input
                        type="number"
                        min="0"
                        value={batchData.positive}
                        onChange={(e) => setBatchData({ ...batchData, positive: e.target.value })}
                        placeholder="Enter count"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Negative Results</label>
                      <input
                        type="number"
                        min="0"
                        value={batchData.negative}
                        onChange={(e) => setBatchData({ ...batchData, negative: e.target.value })}
                        placeholder="Enter count"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Total Preview */}
                  {batchData.positive && batchData.negative && (
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <p className="text-sm text-slate-600">Total Tests:</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Number.parseInt(batchData.positive || 0) + Number.parseInt(batchData.negative || 0)}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={submitBatch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors text-lg"
                  >
                    Submit Batch
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-slate-600">Total Batches</p>
                  <p className="text-2xl font-bold text-blue-600">{batches.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-slate-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">{batches.filter((b) => b.verified).length}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-xs text-slate-600">Total Tests</p>
                  <p className="text-2xl font-bold text-slate-600">{batches.reduce((sum, b) => sum + b.total, 0)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "individual" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Individual Test Record</h2>

            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Patient ID</label>
                  <input
                    type="text"
                    value={individualTest.patientId}
                    onChange={(e) => setIndividualTest({ ...individualTest, patientId: e.target.value })}
                    placeholder="Enter patient ID"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Patient Name</label>
                  <input
                    type="text"
                    value={individualTest.patientName}
                    onChange={(e) => setIndividualTest({ ...individualTest, patientName: e.target.value })}
                    placeholder="Enter patient name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Disease */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Disease</label>
                <select
                  value={individualTest.disease}
                  onChange={(e) => {
                    const disease = e.target.value
                    setIndividualTest({
                      ...individualTest,
                      disease,
                      testType: TEST_TYPES[disease as keyof typeof TEST_TYPES][0] || "",
                    })
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DISEASES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Test Type</label>
                <select
                  value={individualTest.testType}
                  onChange={(e) => setIndividualTest({ ...individualTest, testType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(TEST_TYPES[individualTest.disease as keyof typeof TEST_TYPES] || []).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Result</label>
                <div className="flex gap-4">
                  {(["positive", "negative", "pending"] as const).map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="result"
                        value={r}
                        checked={individualTest.result === r}
                        onChange={(e) =>
                          setIndividualTest({
                            ...individualTest,
                            result: e.target.value as typeof individualTest.result,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium capitalize">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
                <textarea
                  value={individualTest.notes}
                  onChange={(e) => setIndividualTest({ ...individualTest, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={submitIndividualTest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Record Test
              </button>
            </div>
          </div>
        )}

        {view === "history" && (
          <div className="space-y-6">
            {/* Batch History */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Batch History</h2>
              {batches.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No batch entries yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {batches.map((batch) => (
                    <div key={batch.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">{batch.disease} Batch</p>
                          <p className="text-sm text-slate-600">
                            {batch.date} - {batch.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">{batch.total} Tests</p>
                          <p className="text-xs text-slate-600">
                            {batch.positive}+ / {batch.negative}-
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!batch.verified && (
                          <button
                            onClick={() => verifyBatch(batch.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded transition-colors text-sm"
                          >
                            <Eye className="w-3 h-3 inline mr-1" />
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => deleteBatch(batch.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded transition-colors text-sm"
                        >
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Individual Tests History */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Individual Tests</h2>
              {tests.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No individual tests yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tests.map((test) => (
                    <div key={test.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">{test.patientName}</p>
                          <p className="text-sm text-slate-600">ID: {test.patientId}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            test.result === "positive"
                              ? "bg-red-100 text-red-700"
                              : test.result === "negative"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {test.result.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-2">
                        {test.disease} - {test.testType}
                      </p>
                      <p className="text-xs text-slate-500">{test.timestamp}</p>

                      <button
                        onClick={() => deleteTest(test.id)}
                        className="mt-3 w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
