"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, PawPrint, Shield, User as UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  // Calculamos si es admin basándonos en el array de roles que viene del backend
  const isAdmin = user?.roles?.some(role => role === "ROLE_ADMIN" || role === "ADMIN")

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <PawPrint className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Virtual Pet</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              {isAdmin ? "Panel de Administrador" : "Panel de Usuario"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Shield className="h-3 w-3" />
              <span>Acceso Administrativo</span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isAdmin ? "Administrador del Sistema" : "Usuario Estándar"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()} // El router.push ya está dentro de tu AuthContext.logout
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}