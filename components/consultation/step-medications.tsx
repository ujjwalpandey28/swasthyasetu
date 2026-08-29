"use client"

import { Plus, Trash2, Pill } from "lucide-react"

import { ConsultationMedication } from "@/lib/consultation-store"

interface MedicationsStepProps {
  medications: ConsultationMedication[]
  onChange: (m: ConsultationMedication[]) => void
}

export function MedicationsStep({ medications, onChange }: MedicationsStepProps) {
  const add = () => {
    onChange([
      ...medications,
      {
        id: `med-${Date.now().toString(36)}`,
        name: "",
        dosage: "",
        frequency: "",
      },
    ])
  }

  const update = (id: string, field: keyof ConsultationMedication, value: string) => {
    onChange(
      medications.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )
  }

  const remove = (id: string) => {
    onChange(medications.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Prescribed medications
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add medications prescribed during this visit.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-4" />
          Add medication
        </button>
      </div>

      {medications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Pill className="size-5" />
          </span>
          <p className="mt-3 text-sm font-medium text-foreground">
            No medications added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click “Add medication” to prescribe a new drug.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {medications.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => update(m.id, "name", e.target.value)}
                      placeholder="Amlodipine"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={m.dosage}
                      onChange={(e) => update(m.id, "dosage", e.target.value)}
                      placeholder="5 mg"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={m.frequency}
                      onChange={(e) => update(m.id, "frequency", e.target.value)}
                      placeholder="Once daily"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  aria-label="Remove medication"
                  className="mt-5 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-urgent-muted hover:text-urgent"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
