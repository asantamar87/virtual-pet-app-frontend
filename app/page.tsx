"use client"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya cargó y hay usuario, redirigir al dashboard
    if (!isLoading && user) {
      router.replace("/dashboard")
    }
  }, [user, isLoading, router])

  // Mientras carga o si ya hay usuario (y está redirigiendo), no mostramos el formulario
  if (isLoading || user) return null

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm />
    </main>
  )
}