"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PetStatBar } from "./pet-stat-bar"
import { api, type PetResponse } from "@/lib/api"
import { toast } from "sonner"
import {
  Utensils,
  Gamepad2,
  Moon,
  Heart,
  Trash2,
  Pencil,
  Drumstick,
  Smile,
  Zap,
  HeartPulse,
  Dog,
  Cat,
  Bird,
  Fish,
  Rabbit,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PetCardProps {
  pet: PetResponse
  onUpdate: () => void
  onEdit?: (pet: PetResponse) => void
  showOwner?: boolean
  isAdmin?: boolean
}

const speciesIcons: Record<string, React.ReactNode> = {
  dog: <Dog className="h-8 w-8" />,
  cat: <Cat className="h-8 w-8" />,
  bird: <Bird className="h-8 w-8" />,
  fish: <Fish className="h-8 w-8" />,
  rabbit: <Rabbit className="h-8 w-8" />,
}

export function PetCard({ pet, onUpdate, onEdit, showOwner = false, isAdmin = false }: PetCardProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleAction = async (action: "feed" | "play" | "rest" | "heal") => {
    setIsLoading(action)
    try {
      // 1. Mapeo de acciones para el controlador de Java
      // 'rest' -> 'sleep' (según tu @PostMapping("/{id}/sleep"))
      if (action === "heal") {
        toast.error("La acción de curar no está implementada en el servidor");
        return;
      }

      const backendAction = action === "rest" ? "sleep" : action;
      
      // 2. Ejecutar acción en la API
      await api.petAction(pet.id, backendAction as 'feed' | 'play' | 'sleep');
      
      const messages = {
        feed: `${pet.name} ha sido alimentado`,
        play: `¡Has jugado con ${pet.name}!`,
        rest: `${pet.name} está durmiendo...`
      };
      
      toast.success(messages[action as keyof typeof messages]);
      
      // 3. Notificar al padre para refrescar la lista
      onUpdate(); 
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al realizar la acción");
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async () => {
    try {
      await api.deletePet(pet.id)
      toast.success(`${pet.name} ha sido eliminado`)
      onUpdate()
    } catch (error) {
      toast.error("No se pudo eliminar la mascota")
    }
  }

  const speciesIcon = speciesIcons[pet.species.toLowerCase()] || <Heart className="h-8 w-8" />

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{speciesIcon}</div>
            <div>
              <CardTitle className="text-xl font-bold">{pet.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{pet.species}</p>
              {showOwner && <p className="text-xs text-muted-foreground mt-1">Dueño: {pet.ownerUsername}</p>}
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(pet)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar mascota?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente a {pet.name}. ¿Deseas continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barras de Estado */}
        <div className="space-y-3">
          <PetStatBar
            label="Hambre"
            value={pet.hunger}
            colorClass="bg-orange-500"
            icon={<Drumstick className="h-4 w-4 text-orange-500" />}
          />
          <PetStatBar
            label="Felicidad"
            value={pet.happiness}
            colorClass="bg-yellow-400"
            icon={<Smile className="h-4 w-4 text-yellow-400" />}
          />
          <PetStatBar
            label="Energía"
            value={pet.energy}
            colorClass="bg-blue-500"
            icon={<Zap className="h-4 w-4 text-blue-500" />}
          />
          <PetStatBar
            label="Salud"
            value={pet.health}
            colorClass="bg-green-500"
            icon={<HeartPulse className="h-4 w-4 text-green-500" />}
          />
        </div>

        {/* Botones de Acción */}
        {!isAdmin && (
          <div className="grid grid-cols-4 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("feed")}
              disabled={isLoading !== null}
              className="flex flex-col h-auto py-2 gap-1 hover:bg-orange-50"
            >
              <Utensils className="h-4 w-4 text-orange-600" />
              <span className="text-[10px] font-medium">Comer</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("play")}
              disabled={isLoading !== null}
              className="flex flex-col h-auto py-2 gap-1 hover:bg-yellow-50"
            >
              <Gamepad2 className="h-4 w-4 text-yellow-600" />
              <span className="text-[10px] font-medium">Jugar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("rest")}
              disabled={isLoading !== null}
              className="flex flex-col h-auto py-2 gap-1 hover:bg-blue-50"
            >
              <Moon className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-medium">Dormir</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("heal")}
              disabled={isLoading !== null}
              className="flex flex-col h-auto py-2 gap-1 hover:bg-green-50"
            >
              <Heart className="h-4 w-4 text-green-600" />
              <span className="text-[10px] font-medium">Curar</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}