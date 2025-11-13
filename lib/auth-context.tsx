"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "admin" | "health_official" | "pharmacist" | "lab_technician" | "patient"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  organization?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore auth state from localStorage
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
