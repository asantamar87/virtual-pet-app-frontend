"use client"
import { useState, useEffect, useCallback } from "react"
import { api, PetResponse } from "@/lib/api"
import { PetCard } from "./pet-card"
import { CreatePetDialog } from "./create-pet-dialog"
import { Loader2, Plus, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserDashboard() {
  const [pets, setPets] = useState<PetResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

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

  if (loading) return <Loader2 className="mx-auto mt-20 animate-spin" />

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Mascotas</h1>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2" /> Nueva Mascota</Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <PawPrint className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p>Aún no tienes mascotas virtuales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} onUpdate={loadPets} />
          ))}
        </div>
      )}
      <CreatePetDialog open={open} onOpenChange={setOpen} onSuccess={loadPets} />
    </div>
  )
}