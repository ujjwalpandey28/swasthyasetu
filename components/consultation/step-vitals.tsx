"use client"

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react"

import {
  ConsultationVitals,
  RiskLevel,
  evaluateVitalsRisk,
} from "@/lib/consultation-store"
import { cn } from "@/lib/utils"

interface VitalsStepProps {
  vitals: ConsultationVitals
  onChange: (v: ConsultationVitals) => void
}

const fields: {
  key: keyof ConsultationVitals
  label: string
  unit: string
  placeholder: string
  inputMode?: "numeric" | "decimal"
  half?: boolean
}[] = [
  { key: "bpSystolic", label: "BP Systolic", unit: "mmHg", placeholder: "148", inputMode: "numeric" },
  { key: "bpDiastolic", label: "BP Diastolic", unit: "mmHg", placeholder: "92", inputMode: "numeric" },
  { key: "heartRate", label: "Heart Rate", unit: "bpm", placeholder: "84", inputMode: "numeric" },
  { key: "temperature", label: "Temperature", unit: "°F", placeholder: "98.4", inputMode: "decimal" },
  { key: "weight", label: "Weight", unit: "kg", placeholder: "62", inputMode: "decimal" },
  { key: "bloodGlucose", label: "Blood Glucose", unit: "mg/dL", placeholder: "138", inputMode: "numeric" },
  { key: "oxygenSaturation", label: "Oxygen Sat.", unit: "%", placeholder: "97", inputMode: "numeric" },
]

export function VitalsStep({ vitals, onChange }: VitalsStepProps) {
  const risk = evaluateVitalsRisk(vitals)
  const set = (key: keyof ConsultationVitals, value: string) =>
    onChange({ ...vitals, [key]: value })

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <label
              htmlFor={`vital-${f.key}`}
              className="text-xs font-medium text-muted-foreground"
            >
              {f.label}
            </label>
            <div className="relative">
              <input
                id={`vital-${f.key}`}
                type="text"
                inputMode={f.inputMode ?? "numeric"}
                value={vitals[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <RiskBanner level={risk.level} message={risk.message} elevated={risk.elevated} />
    </div>
  )
}

function RiskBanner({
  level,
  message,
  elevated,
}: {
  level: RiskLevel
  message: string | null
  elevated: { label: string; value: string }[]
}) {
  if (level === "stable" && !message) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-success/25 bg-success-muted/40 px-4 py-3">
        <ShieldCheck className="size-4 text-success" />
        <p className="text-sm font-medium text-success">
          Vitals within expected range
        </p>
      </div>
    )
  }

  const isHigh = level === "high"
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border px-4 py-3.5",
        isHigh
          ? "border-urgent/30 bg-urgent-muted/50"
          : "border-warning/30 bg-warning-muted/50",
      )}
    >
      <div className="flex items-center gap-2.5">
        <ShieldAlert
          className={cn("size-4", isHigh ? "text-urgent" : "text-warning-foreground")}
        />
        <p
          className={cn(
            "text-sm font-semibold",
            isHigh ? "text-urgent" : "text-warning-foreground",
          )}
        >
          {message}
        </p>
      </div>
      {elevated.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pl-6">
          {elevated.map((e) => (
            <li
              key={e.label}
              className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[11px] font-medium text-foreground"
            >
              <AlertTriangle
                className={cn("size-3", isHigh ? "text-urgent" : "text-warning-foreground")}
              />
              {e.label}: {e.value}
            </li>
          ))}
        </ul>
      )}
      <p className="pl-6 text-[11px] text-muted-foreground">
        Prototype logic — thresholds are illustrative, not clinical guidance.
      </p>
    </div>
  )
}
