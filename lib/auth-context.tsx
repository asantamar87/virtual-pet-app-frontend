"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  roles: string[]
  token?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.replace("/") 
  }, [router])

  useEffect(() => {
    const loadStorage = () => {
      try {
        const strUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")
        if (strUser && token) {
          setUser({ ...JSON.parse(strUser), token })
        }
      } catch (e) {
        console.error("Error loading session:", e)
        logout()
      } finally {
        setIsLoading(false)
      }
    }
    loadStorage()
  }, [logout])

  const handleSetUser = (newUser: User | null) => {
    if (newUser) {
      const { token, ...userData } = newUser
      localStorage.setItem("user", JSON.stringify(userData))
      if (token) localStorage.setItem("token", token)
      setUser(newUser)
    } else {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, isLoading, logout }}>
      {/* BLOQUEO CRÍTICO: No renderiza nada hasta que isLoading sea false */}
      {!isLoading ? children : (
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-primary font-medium">Iniciando sistema...</div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe estar dentro de AuthProvider")
  return context
}