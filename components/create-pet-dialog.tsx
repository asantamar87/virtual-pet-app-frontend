"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type PetResponse } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, AlertCircle } from "lucide-react"

interface CreatePetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editPet?: PetResponse | null
}

const speciesOptions = [
  { value: "dog", label: "Perro 🐕" },
  { value: "cat", label: "Gato 🐱" },
  { value: "bird", label: "Pájaro 🐦" },
  { value: "fish", label: "Pez 🐟" },
  { value: "rabbit", label: "Conejo 🐰" },
]

export function CreatePetDialog({ open, onOpenChange, onSuccess, editPet }: CreatePetDialogProps) {
  const [name, setName] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Captura errores de validación del backend

  useEffect(() => {
    if (open) {
      setError(null) // Limpiar errores al abrir
      if (editPet) {
        setName(editPet.name)
        setSelectedSpecies(editPet.species.toLowerCase())
      } else {
        setName("")
        setSelectedSpecies("")
      }
    }
  }, [editPet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !selectedSpecies) return

    setIsLoading(true)
    setError(null)
    
    try {
      if (editPet) {
        // Corrección: usamos api.updatePet
        await api.updatePet(editPet.id, { name, species: selectedSpecies })
        toast.success("Mascota actualizada correctamente")
      } else {
        await api.createPet({ name, species: selectedSpecies })
        toast.success("¡Mascota creada con éxito!")
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      // Capturamos el mensaje del backend (ej: error de validación de caracteres)
      const backendMessage = err.response?.data?.message || (editPet ? "Error al actualizar" : "Error al crear")
      setError(backendMessage)
      toast.error("Hubo un problema con la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setError(null); // Limpiar error al cerrar
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editPet ? "Editar Mascota" : "Nueva Mascota"}</DialogTitle>
          <DialogDescription>
            {editPet 
              ? `Estás editando los datos de ${editPet.name}` 
              : "Añade una nueva mascota virtual al sistema"}
          </DialogDescription>
        </DialogHeader>

        {/* Banner de Error Visual */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2 animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ej: Balto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={error ? "border-destructive focus-visible:ring-destructive" : ""}
                required
              />
              <p className="text-[10px] text-muted-foreground">Mínimo 2 caracteres.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Especie</Label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especie" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name || !selectedSpecies}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editPet ? "Guardar Cambios" : "Crear Mascota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}