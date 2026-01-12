"use client"

import { useState, useEffect, useCallback } from "react"
import { PetCard } from "./pet-card"
import { DashboardHeader } from "./dashboard-header"
import { api, type PetResponse } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { PawPrint, Loader2, Search, Users, Activity, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminDashboard() {
  const [pets, setPets] = useState<PetResponse[]>([])
  const [filteredPets, setFilteredPets] = useState<PetResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPets = useCallback(async () => {
    try {
      // Llamamos al nuevo método de la API
      const data = await api.getMyPets()
      setPets(data)
      setFilteredPets(data)
    } catch (error) {
      toast.error("No tienes permisos o hubo un error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPets()
  }, [fetchPets])

  useEffect(() => {
    const filtered = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.ownerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPets(filtered)
  }, [searchTerm, pets])

  // Cálculo de estadísticas usando ownerUsername ya que ownerId no está en tu interfaz
  const uniqueOwners = new Set(pets.map((p) => p.ownerUsername)).size
  
  const avgHealth = pets.length > 0 
    ? Math.round(pets.reduce((acc, p) => acc + p.health, 0) / pets.length) 
    : 0
    
  const avgHappiness = pets.length > 0 
    ? Math.round(pets.reduce((acc, p) => acc + p.happiness, 0) / pets.length) 
    : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Mascotas</CardTitle>
              <PawPrint className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios con Mascotas</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueOwners}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salud Global</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgHealth}%</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Felicidad Global</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgHappiness}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
            <p className="text-muted-foreground mt-1">Supervisión general del ecosistema de mascotas</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por mascota, dueño o especie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Consultando base de datos...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
            <PawPrint className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold">Sin resultados</h3>
            <p className="text-muted-foreground">No hay registros que coincidan con los criterios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onUpdate={fetchPets} 
                showOwner 
                isAdmin={true} // El modo admin oculta los botones de acción para que el admin no juegue con mascotas ajenas
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}