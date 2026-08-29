"use client"

import { Activity, Stethoscope } from "lucide-react"

import { useConsultations } from "@/lib/consultation-store"
import { cn } from "@/lib/utils"

const riskTone: Record<string, string> = {
  high: "bg-urgent-muted text-urgent",
  moderate: "bg-warning-muted text-warning-foreground",
  stable: "bg-success-muted text-success",
}

export function ConsultationTimeline() {
  const items = useConsultations()

  if (items.length === 0) return null

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="size-4 text-teal" />
        <h2 className="text-base font-semibold text-foreground">
          Recent consultations
        </h2>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Visits recorded during this session
      </p>

      <ol className="mt-4 flex flex-col gap-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="flex gap-3 rounded-xl border border-border bg-background p-3.5"
          >
            <span className="mt-1 size-2 shrink-0 rounded-full bg-teal" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {c.diagnosis || "Consultation recorded"}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                    riskTone[c.riskLevel] ?? riskTone.stable,
                  )}
                >
                  {c.riskLevel} risk
                </span>
              </div>
              {c.clinicalNotes && (
                <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                  {c.clinicalNotes}
                </p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Activity className="size-3" />
                  {c.dateLabel} · {c.facility}
                </span>
                {c.symptoms.length > 0 && (
                  <span>Symptoms: {c.symptoms.join(", ")}</span>
                )}
                {c.medications.length > 0 && (
                  <span>
                    Rx:{" "}
                    {c.medications
                      .map((m) => `${m.name} ${m.dosage}`.trim())
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
