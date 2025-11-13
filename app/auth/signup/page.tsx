"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus, AlertCircle } from "lucide-react"

type UserRole = "admin" | "health_official" | "pharmacist" | "lab_technician"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "health_official" as UserRole,
    organization: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      router.push("/auth/login?registered=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    { value: "admin", label: "Administrator", description: "Manage system, data uploads, models" },
    { value: "health_official", label: "Health Official", description: "View forecasts, alerts, reports" },
    { value: "pharmacist", label: "Pharmacist", description: "Enter daily pharmacy sales data" },
    { value: "lab_technician", label: "Lab Technician", description: "Enter lab test results" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-emerald-500/5 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-6">
            <UserPlus className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Create Account</h1>
          <p className="text-center text-slate-600 mb-8">Join MSDP for proactive disease surveillance</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Health Department / Hospital"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Role</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start p-3 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <label className="flex items-start">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 mt-1" required />
              <span className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
