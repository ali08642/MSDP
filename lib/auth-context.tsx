"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api, TokenManager } from "./api"

export type UserRole = "ADMIN" | "HEALTH_OFFICIAL" | "PHARMACIST" | "LAB_TECH"

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: UserRole
  }) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const accessToken = TokenManager.getAccessToken()
      
      if (accessToken) {
        try {
          const userData = await api.auth.getProfile()
          setUser(userData)
        } catch (error) {
          console.error('Failed to load user profile:', error)
          TokenManager.clearTokens()
        }
      }
      
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password)
      setUser(response.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: UserRole
  }) => {
    try {
      const response = await api.auth.register(userData)
      setUser(response.user)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    await api.auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        logout, 
        login, 
        register,
        isAuthenticated: !!user 
      }}
    >
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
