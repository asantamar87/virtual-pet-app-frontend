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
import { Loader2 } from "lucide-react"

interface CreatePetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editPet?: PetResponse | null
}

const species = [
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

  useEffect(() => {
    if (editPet) {
      setName(editPet.name)
      setSelectedSpecies(editPet.species.toLowerCase())
    } else {
      setName("")
      setSelectedSpecies("")
    }
  }, [editPet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !selectedSpecies) return

    setIsLoading(true)
    try {
      if (editPet) {
        await api.updatePet(editPet.id, { name, species: selectedSpecies })
        toast.success("Mascota actualizada correctamente")
      } else {
        await api.createPet({ name, species: selectedSpecies })
        toast.success("Mascota creada correctamente")
      }
      onSuccess()
      onOpenChange(false)
      setName("")
      setSelectedSpecies("")
    } catch {
      toast.error(editPet ? "Error al actualizar mascota" : "Error al crear mascota")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editPet ? "Editar Mascota" : "Nueva Mascota"}</DialogTitle>
          <DialogDescription>
            {editPet ? "Actualiza los datos de tu mascota" : "Crea una nueva mascota virtual para cuidar"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre de tu mascota"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Especie</Label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especie" />
                </SelectTrigger>
                <SelectContent>
                  {species.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name || !selectedSpecies}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editPet ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
