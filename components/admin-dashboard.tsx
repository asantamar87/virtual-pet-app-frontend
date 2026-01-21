"use client"

import { useState, useEffect, useCallback } from "react"
import { PetCard } from "./pet-card"
import { DashboardHeader } from "./dashboard-header"
import { api, type PetResponse } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { PawPrint, Loader2, Search, Users, Activity, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditPetModal } from "./edit-pet-modal" // Importamos el modal
import { useAuth } from "@/lib/auth-context"

export function AdminDashboard() {
  const { user } = useAuth()
  const [pets, setPets] = useState<PetResponse[]>([])
  const [filteredPets, setFilteredPets] = useState<PetResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estado para controlar qué mascota se está editando
  const [editingPet, setEditingPet] = useState<PetResponse | null>(null)

  const fetchPets = useCallback(async () => {
    setIsLoading(true)
    try {
      // Llamada al endpoint /api/pets/all que configuramos en el backend
      const data = await api.getAllPets() 
      setPets(data)
      setFilteredPets(data)
    } catch (error) {
      console.error("Admin fetch error:", error)
      toast.error("Error de acceso: Asegúrate de tener permisos de administrador.")
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

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeletePet = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta mascota del sistema de forma permanente?")) return
    
    try {
      await api.deletePet(id)
      toast.success("Mascota eliminada correctamente")
      fetchPets() // Refrescar lista global
    } catch (error) {
      toast.error("No se pudo eliminar la mascota")
    }
  }

  // Estadísticas globales
  const uniqueOwners = new Set(pets.map((p) => p.ownerUsername)).size
  const avgHealth = pets.length > 0 ? Math.round(pets.reduce((acc, p) => acc + p.health, 0) / pets.length) : 0
  const avgHappiness = pets.length > 0 ? Math.round(pets.reduce((acc, p) => acc + p.happiness, 0) / pets.length) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Mascotas</CardTitle>
              <PawPrint className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{pets.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{uniqueOwners}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salud Global</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{avgHealth}%</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Felicidad Global</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{avgHappiness}%</div></CardContent>
          </Card>
        </div>

        {/* Título y Buscador */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Administración Global</h2>
            <p className="text-muted-foreground">Gestión total de mascotas y cumplimiento de normas</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar mascota o dueño..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>

        {/* Grid de Mascotas */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onUpdate={fetchPets} // Refrescar tras interactuar
                onEdit={() => setEditingPet(pet)} // Nueva prop para abrir modal
                onDelete={() => handleDeletePet(pet.id)} // Nueva prop para borrar
                showOwner={true} 
                isAdmin={true} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de Edición Global */}
      {editingPet && (
        <EditPetModal 
          pet={editingPet} 
          token={user?.token!} 
          onClose={() => setEditingPet(null)}
          onUpdate={fetchPets}
        />
      )}
    </div>
  )
}