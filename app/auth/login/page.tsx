"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Call Django backend API through auth context
      await login(formData.email, formData.password)
      
      // Router will be called in useEffect after user state updates
    } catch (err: any) {
      setError(err?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  // Redirect after successful login
  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case "ADMIN":
          router.push("/admin/dashboard")
          break
        case "HEALTH_OFFICIAL":
          router.push("/health-official/dashboard")
          break
        case "PHARMACIST":
          router.push("/pharmacist/data-entry")
          break
        case "LAB_TECH":
          router.push("/lab/data-entry")
          break
        default:
          router.push("/")
      }
    }
  }, [user, router])

  const demoUsers = [
    { email: "admin@msdp.pk", password: "admin123", role: "Admin" },
    { email: "official@msdp.pk", password: "official123", role: "Health Official" },
    { email: "pharmacist@msdp.pk", password: "pharmacist123", role: "Pharmacist" },
    { email: "lab@msdp.pk", password: "lab123", role: "Lab Technician" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-emerald-500/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-6">
            <LogIn className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Sign In</h1>
          <p className="text-center text-slate-600 mb-8">Access your MSDP account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or try demo accounts</span>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {demoUsers.map((user, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, email: user.email, password: user.password })}
                className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <p className="font-medium text-foreground">{user.role}</p>
                <p className="text-slate-500 text-xs">{user.email}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-slate-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
