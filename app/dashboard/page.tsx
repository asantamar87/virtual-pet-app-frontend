"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya cargó y NO hay usuario, mandarlo al login
    if (!isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router])

  // Bloqueo de renderizado preventivo
  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Verificando sesión...</p>
      </div>
    )
  }

  // Lógica de roles
  const isAdmin = user.roles?.some((role: string) => 
    role === "ROLE_ADMIN" || role === "ADMIN"
  )

  return isAdmin ? <AdminDashboard /> : <UserDashboard />
}