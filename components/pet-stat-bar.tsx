"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface PetStatBarProps {
  label: string
  value: number
  maxValue?: number
  colorClass: string
  icon: React.ReactNode
}

export function PetStatBar({ label, value, maxValue = 100, colorClass, icon }: PetStatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-mono font-medium">
          {value}/{maxValue}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
