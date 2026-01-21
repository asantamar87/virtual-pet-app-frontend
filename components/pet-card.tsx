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
  ShieldCheck,
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
  onDelete?: () => void // Añadida para el manejo global desde el AdminDashboard
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

export function PetCard({ pet, onUpdate, onEdit, onDelete, showOwner = false, isAdmin = false }: PetCardProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleAction = async (action: "feed" | "play" | "rest" | "heal") => {
    if (action === "heal") {
      toast.info("La acción de curar se activará automáticamente al descansar o comer bien.");
      return;
    }

    setIsLoading(action)
    try {
      const backendAction = action === "rest" ? "sleep" : action;
      await api.petAction(pet.id, backendAction as 'feed' | 'play' | 'sleep');
      
      const messages = {
        feed: `¡Yum! ${pet.name} ha comido delicioso.`,
        play: `¡Diversión! Has jugado con ${pet.name}.`,
        rest: `Zzz... ${pet.name} está descansando.`
      };
      
      toast.success(messages[action as keyof typeof messages] || "Acción realizada");
      onUpdate(); 
    } catch (error) {
      toast.error("Error al realizar la acción");
    } finally {
      setIsLoading(null)
    }
  }

const handleDelete = async () => {
  if (onDelete) {
    onDelete();
    return;
  }

  try {
    await api.deletePet(pet.id)
    toast.success(`${pet.name} ha sido eliminado`)
    onUpdate()
  } catch (error: any) {
    // Usamos el mensaje que viene del backend (ej: "Acceso denegado")
    toast.error(error.message || "No se pudo eliminar la mascota");
  }
}

  const speciesIcon = speciesIcons[pet.species.toLowerCase()] || <Heart className="h-8 w-8" />

  return (
    <Card className={`relative overflow-hidden transition-all shadow-sm border-border hover:border-primary/50 ${isAdmin ? 'border-l-4 border-l-blue-500' : ''}`}>
      {isAdmin && (
        <div className="absolute top-0 right-0 p-1 bg-blue-500 text-white rounded-bl-lg" title="Modo Administrador">
          <ShieldCheck className="h-3 w-3" />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{speciesIcon}</div>
            <div>
              <CardTitle className="text-xl font-bold">{pet.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{pet.species}</p>
              {showOwner && (
                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-blue-600">
                  <span>Dueño:</span>
                  <span className="bg-blue-50 px-1.5 py-0.5 rounded">{pet.ownerUsername}</span>
                </div>
              )}
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
                  <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {isAdmin 
                      ? `Como administrador, vas a eliminar la mascota "${pet.name}" propiedad de "${pet.ownerUsername}".`
                      : `Esta acción eliminará permanentemente a ${pet.name}. ¿Deseas continuar?`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <PetStatBar label="Hambre" value={pet.hunger} colorClass="bg-orange-500" icon={<Drumstick className="h-3 w-3 text-orange-500" />} />
          <PetStatBar label="Felicidad" value={pet.happiness} colorClass="bg-yellow-400" icon={<Smile className="h-3 w-3 text-yellow-400" />} />
          <PetStatBar label="Energía" value={pet.energy} colorClass="bg-blue-500" icon={<Zap className="h-3 w-3 text-blue-500" />} />
          <PetStatBar label="Salud" value={pet.health} colorClass="bg-green-500" icon={<HeartPulse className="h-3 w-3 text-green-500" />} />
        </div>

        {!isAdmin ? (
          <div className="grid grid-cols-4 gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => handleAction("feed")} disabled={isLoading !== null} className="flex flex-col h-auto py-2 gap-1 hover:bg-orange-50">
              <Utensils className="h-4 w-4 text-orange-600" />
              <span className="text-[10px] font-medium">Comer</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction("play")} disabled={isLoading !== null} className="flex flex-col h-auto py-2 gap-1 hover:bg-yellow-50">
              <Gamepad2 className="h-4 w-4 text-yellow-600" />
              <span className="text-[10px] font-medium">Jugar</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction("rest")} disabled={isLoading !== null} className="flex flex-col h-auto py-2 gap-1 hover:bg-blue-50">
              <Moon className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-medium">Dormir</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction("heal")} disabled={isLoading !== null} className="flex flex-col h-auto py-2 gap-1 hover:bg-green-50">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="text-[10px] font-medium">Curar</span>
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <div className="text-[10px] text-center text-muted-foreground bg-muted py-1 rounded border border-dashed">
              Modo Gestión: Acciones de cuidado deshabilitadas
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}