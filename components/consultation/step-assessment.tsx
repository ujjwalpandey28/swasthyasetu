"use client"

interface AssessmentStepProps {
  diagnosis: string
  clinicalNotes: string
  recommendedAction: string
  onChange: (d: string, n: string, a: string) => void
}

const actionOptions = [
  "Continue current medication",
  "Adjust medication dosage",
  "Order lab investigations",
  "Lifestyle & dietary advice",
  "Specialist review required",
] as const

export function AssessmentStep({
  diagnosis,
  clinicalNotes,
  recommendedAction,
  onChange,
}: AssessmentStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="diagnosis"
          className="text-sm font-semibold text-foreground"
        >
          Diagnosis
        </label>
        <input
          id="diagnosis"
          type="text"
          value={diagnosis}
          onChange={(e) => onChange(e.target.value, clinicalNotes, recommendedAction)}
          placeholder="Hypertension — under evaluation"
          className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div>
        <label
          htmlFor="clinical-notes"
          className="text-sm font-semibold text-foreground"
        >
          Clinical notes
        </label>
        <textarea
          id="clinical-notes"
          value={clinicalNotes}
          onChange={(e) => onChange(diagnosis, e.target.value, recommendedAction)}
          rows={5}
          placeholder="Chest discomfort evaluated. Cardiac cause to be ruled out. Advised salt restriction and home BP monitoring."
          className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground">
          Recommended action
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select one or type a custom action.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {actionOptions.map((a) => {
            const active = recommendedAction === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => onChange(diagnosis, clinicalNotes, a)}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40")
                }
              >
                {a}
              </button>
            )
          })}
        </div>
        <input
          type="text"
          value={recommendedAction}
          onChange={(e) => onChange(diagnosis, clinicalNotes, e.target.value)}
          placeholder="Or type a custom action…"
          className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30"
        />
      </div>
    </div>
  )
}
