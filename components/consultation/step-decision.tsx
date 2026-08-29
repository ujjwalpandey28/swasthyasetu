"use client"

import { ArrowRight, CheckCircle2, FileCheck2, Send } from "lucide-react"

interface DecisionStepProps {
  onComplete: () => void
  onRefer: () => void
}

export function DecisionStep({ onComplete, onRefer }: DecisionStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold text-foreground">
        Choose next action
      </h4>
      <p className="text-xs text-muted-foreground">
        Finalize the consultation, or carry the recorded data into a referral.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onComplete}
          className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-success/40 hover:shadow-md"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-success-muted text-success">
            <CheckCircle2 className="size-6" />
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">
              Complete Consultation
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Save the visit to the patient&apos;s timeline and return to their
              profile.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
            <FileCheck2 className="size-4" />
            Save &amp; finish
          </span>
        </button>

        <button
          type="button"
          onClick={onRefer}
          className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Send className="size-6" />
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">
              Create Referral
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Carry the consultation context into a new referral to another
              facility.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Continue to referral
            <ArrowRight className="size-4" />
          </span>
        </button>
      </div>
    </div>
  )
}
