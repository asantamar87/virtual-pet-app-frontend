"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { UserDashboard } from "@/components/user-dashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router, mounted])

  if (!mounted || isLoading) return <div className="p-10 text-center">Cargando...</div>

  if (!user) return null

  // Si hay usuario (aunque no tenga roles definidos todavía), mostramos el UserDashboard
  return <UserDashboard />
}