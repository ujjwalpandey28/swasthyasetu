"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepMeta {
  key: string
  label: string
}

export function ConsultationStepper({
  steps,
  current,
  onStepClick,
}: {
  steps: StepMeta[]
  current: number
  onStepClick?: (index: number) => void
}) {
  return (
    <ol className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        const clickable = onStepClick && i <= current
        return (
          <li key={s.key} className="flex flex-1 items-center gap-1.5">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(i)}
              className={cn(
                "flex flex-1 flex-col gap-1.5 text-left transition-opacity",
                !clickable && "cursor-default",
                clickable && "cursor-pointer hover:opacity-80",
              )}
            >
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  done || active ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium transition-colors",
                  done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {done && <Check className="size-3 text-primary" />}
                <span className="truncate">{s.label}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
