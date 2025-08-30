"use client"
import { createContext, useContext, useMemo, useState } from 'react'

export type AuthUser = {
  id: string
  name: string
  email?: string
}
//deneme
type AuthContextType = {
  user: AuthUser | null
  signInWithEmail: (email: string, name?: string) => void
  signInWithGoogle: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const signInWithEmail = (email: string, name?: string) => {
    setUser({ id: 'u_email', name: name || email.split('@')[0], email })
  }

  const signInWithGoogle = () => {
    setUser({ id: 'u_google', name: 'Google User', email: 'google@example.com' })
  }

  const signOut = () => setUser(null)

  const value = useMemo(() => ({ user, signInWithEmail, signInWithGoogle, signOut }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

