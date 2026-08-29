"use client"

import { useEffect } from "react"
import { AlertTriangle, ShieldAlert, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmergencyAccessModalProps {
  open: boolean
  patientName: string
  onClose: () => void
  onConfirm: () => void
}

export function EmergencyAccessModal({
  open,
  patientName,
  onClose,
  onConfirm,
}: EmergencyAccessModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <span className="flex size-12 items-center justify-center rounded-xl bg-urgent-muted text-urgent">
          <ShieldAlert className="size-6" />
        </span>

        <h2
          id="emergency-title"
          className="mt-4 text-lg font-semibold text-foreground text-balance"
        >
          Confirm Emergency Access
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          You are about to open {patientName}&apos;s record without patient
          consent. Only <span className="font-medium text-foreground">critical
          information</span> — allergies, active medications, blood group and
          recent alerts — will be available initially.
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-urgent/20 bg-urgent-muted/50 px-3.5 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-urgent" />
          <p className="text-xs leading-relaxed text-foreground">
            This action is logged to the patient&apos;s audit trail with your
            identity, facility and timestamp. Use only in genuine emergencies.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
          <Button
            onClick={onConfirm}
            className="w-full bg-urgent text-urgent-foreground hover:bg-urgent/90 sm:w-auto"
          >
            Confirm &amp; Open Critical Record
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
