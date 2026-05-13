"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_EMAIL = "andrescmg06@gmail.com"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("luxara_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from localStorage
    const usersData = localStorage.getItem("luxara_users")
    const users = usersData ? JSON.parse(usersData) : []

    // Find user
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        isAdmin: foundUser.email === ADMIN_EMAIL ? true : foundUser.isAdmin || false,
      }
      setUser(userSession)
      localStorage.setItem("luxara_user", JSON.stringify(userSession))
      return true
    }

    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Get existing users
    const usersData = localStorage.getItem("luxara_users")
    const users = usersData ? JSON.parse(usersData) : []

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      isAdmin: email === ADMIN_EMAIL,
    }

    users.push(newUser)
    localStorage.setItem("luxara_users", JSON.stringify(users))

    // Auto login
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
    }
    setUser(userSession)
    localStorage.setItem("luxara_user", JSON.stringify(userSession))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("luxara_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
