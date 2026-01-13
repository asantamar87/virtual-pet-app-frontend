"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // 1. Aseguramos el montaje del componente para evitar errores de Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Manejo de redirección: Solo si YA terminó de cargar y NO hay usuario
  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router, mounted])

  // 3. Mientras carga o no está montado, mostramos el spinner
  if (!mounted || isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Verificando sesión...</p>
      </div>
    )
  }

  // 4. Si después de cargar NO hay usuario, retornamos null (el useEffect redirigirá)
  if (!user) return null

  // 5. Lógica de roles (verificamos ambos formatos por si acaso)
  const isAdmin = user.roles?.some((role: string) => 
    role === "ROLE_ADMIN" || role === "ADMIN"
  )

  return isAdmin ? <AdminDashboard /> : <UserDashboard />
}