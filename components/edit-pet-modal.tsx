"use client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface Pet {
  id: number
  name: string
  species: string
}

export function EditPetModal({ pet, token, onClose, onUpdate }: { 
  pet: Pet, 
  token: string, 
  onClose: () => void, 
  onUpdate: (updatedPet: any) => void 
}) {
  const [name, setName] = useState(pet.name)
  const [species, setSpecies] = useState(pet.species)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`http://localhost:8080/api/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, species })
      })

      if (response.ok) {
        const updated = await response.json()
        onUpdate(updated)
        onClose()
      }
    } catch (error) {
      console.error("Error actualizando mascota:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Editar Mascota (ID: {pet.id})</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input 
              className="w-full border p-2 rounded"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
      
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}