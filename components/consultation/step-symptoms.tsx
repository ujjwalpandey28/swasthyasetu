"use client"

import { symptomOptions } from "@/lib/consultation-store"
import { cn } from "@/lib/utils"

interface SymptomsStepProps {
  symptoms: string[]
  notes: string
  onChange: (symptoms: string[], notes: string) => void
}

export function SymptomsStep({ symptoms, notes, onChange }: SymptomsStepProps) {
  const toggle = (s: string) => {
    if (symptoms.includes(s)) {
      onChange(symptoms.filter((x) => x !== s), notes)
    } else {
      onChange([...symptoms, s], notes)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="text-sm font-semibold text-foreground">
          Reported symptoms
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tap all that apply.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {symptomOptions.map((s) => {
            const active = symptoms.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="symptom-notes"
          className="text-sm font-semibold text-foreground"
        >
          Clinical notes
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Describe the patient&apos;s presentation in your own words.
        </p>
        <textarea
          id="symptom-notes"
          value={notes}
          onChange={(e) => onChange(symptoms, e.target.value)}
          rows={5}
          placeholder="Patient reports intermittent chest discomfort over the past two weeks, worse on exertion…"
          className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>
    </div>
  )
}
