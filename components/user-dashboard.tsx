"use client"
import { useState, useEffect, useCallback } from "react"
import { api, type PetResponse } from "@/lib/api" // Importante el 'type'
import { PetCard } from "./pet-card"
import { CreatePetDialog } from "./create-pet-dialog"
import { Loader2, Plus, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "./dashboard-header"

export function UserDashboard() {
  const [pets, setPets] = useState<PetResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  
  // ESTADO PARA EDICIÓN: Controla qué mascota se pasa al diálogo
  const [editingPet, setEditingPet] = useState<PetResponse | null>(null)

  const loadPets = useCallback(async () => {
    try {
      const data = await api.getMyPets()
      setPets(data)
    } catch (e) {
      console.error("Error al cargar mascotas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPets() }, [loadPets])

  // Función para abrir el modal en modo "Creación"
  const handleCreateOpen = () => {
    setEditingPet(null) // Limpiamos cualquier mascota previa
    setOpen(true)
  }

  // Función para abrir el modal en modo "Edición"
  const handleEditOpen = (pet: PetResponse) => {
    setEditingPet(pet) // Cargamos la mascota a editar
    setOpen(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mis Mascotas</h2>
            <p className="text-muted-foreground mt-1">Cuida y alimenta a tus mascotas virtuales</p>
          </div>
          <Button onClick={handleCreateOpen} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nueva Mascota
          </Button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
            <PawPrint className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">El refugio está vacío</h3>
            <p className="text-muted-foreground mb-6">Aún no tienes mascotas virtuales para cuidar.</p>
            <Button variant="outline" onClick={handleCreateOpen}>Adoptar mi primera mascota</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onUpdate={loadPets} 
                onEdit={() => handleEditOpen(pet)} // Pasamos la función de edición
              />
            ))}
          </div>
        )}
      </main>

      {/* DIÁLOGO ÚNICO: Funciona para crear (si editingPet es null) o editar */}
      <CreatePetDialog 
        open={open} 
        onOpenChange={setOpen} 
        onSuccess={loadPets} 
        editPet={editingPet} 
      />
    </div>
  )
}