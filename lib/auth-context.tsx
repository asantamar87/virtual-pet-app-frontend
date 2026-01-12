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
    router.replace("/") // Redirigir al login inmediatamente
  }, [router])

  useEffect(() => {
    const loadStorage = () => {
      try {
        const strUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (strUser && token) {
          const parsedUser = JSON.parse(strUser)
          // Sincronizamos el estado global con el token fresco
          setUser({ ...parsedUser, token })
        }
      } catch (e) {
        console.error("Error cargando sesión:", e)
        logout() // Si hay error en el storage, limpiamos por seguridad
      } finally {
        setIsLoading(false)
      }
    }
    loadStorage()
  }, [logout])

  const handleSetUser = (newUser: User | null) => {
    if (newUser) {
      setUser(newUser)
      // Separamos el token para guardarlo en llaves distintas
      const { token, ...userData } = newUser
      localStorage.setItem("user", JSON.stringify(userData))
      if (token) {
        localStorage.setItem("token", token)
      }
    } else {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      isLoading, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe estar dentro de AuthProvider")
  }
  return context
}