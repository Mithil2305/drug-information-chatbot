import React, { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest, registerRequest, getMeRequest, UserProfile } from '../api/auth'

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('labelproof_token'))
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const profile = await getMeRequest()
          setUser(profile)
        } catch (err) {
          console.error('Failed to restore authentication session:', err)
          logout()
        }
      }
      setLoading(false)
    }
    initializeAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await loginRequest(email, password)
      localStorage.setItem('labelproof_token', res.access_token)
      setToken(res.access_token)
      
      const profile = await getMeRequest()
      setUser(profile)
    } catch (err) {
      logout()
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setLoading(true)
    try {
      await registerRequest(email, password)
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('labelproof_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
