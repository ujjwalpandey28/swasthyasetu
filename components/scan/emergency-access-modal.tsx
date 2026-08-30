"use client"

import { useEffect, useState } from "react"
import { TriangleAlert as AlertTriangle, BadgeCheck, CircleCheck as CheckCircle2, Droplet, HeartPulse, Pill, ShieldAlert, UserRound, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { patientProfile } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface EmergencyAccessModalProps {
  open: boolean
  patientName: string
  onClose: () => void
  onConfirm: () => void
}

const reasons = [
  "Patient unconscious",
  "Life-threatening emergency",
  "Other emergency",
] as const

export function EmergencyAccessModal({
  open,
  patientName,
  onClose,
  onConfirm,
}: EmergencyAccessModalProps) {
  const [reason, setReason] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!open) return
    setReason(null)
    setConfirmed(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const p = patientProfile

  function handleConfirm() {
    setConfirmed(true)
    setTimeout(() => {
      onConfirm()
    }, 1600)
  }

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
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-bottom-4">
        {confirmed ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-success text-success-foreground animate-in zoom-in">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Access granted
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground text-pretty">
              This event has been logged to the patient&apos;s audit trail with
              your identity, facility and timestamp.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/25 bg-success-muted/40 px-4 py-2.5">
              <ShieldAlert className="size-4 text-success" />
              <p className="text-xs font-medium text-success">
                Emergency access active — critical information only
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-urgent-muted text-urgent">
                  <ShieldAlert className="size-5.5" />
                </span>
                <div>
                  <h2
                    id="emergency-title"
                    className="text-lg font-semibold text-foreground text-balance"
                  >
                    Emergency Access
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                    You are requesting access to critical patient information
                    outside the standard consent flow.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1.5 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {/* Reason selection */}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Reason for emergency access
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select the reason that best describes the situation.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {reasons.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        reason === r
                          ? "border-urgent/40 bg-urgent-muted/40 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          reason === r
                            ? "border-urgent bg-urgent"
                            : "border-border",
                        )}
                      >
                        {reason === r && (
                          <span className="size-2 rounded-full bg-urgent-foreground" />
                        )}
                      </span>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Critical info preview */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-foreground">
                  Critical information to be shown
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Only essential clinical data will be available. Full history
                  requires patient consent.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <CriticalItem
                    icon={AlertTriangle}
                    label="Allergy"
                    value={p.allergies.join(", ")}
                    tone="urgent"
                  />
                  <CriticalItem
                    icon={Droplet}
                    label="Blood group"
                    value={p.bloodGroup}
                  />
                  <CriticalItem
                    icon={HeartPulse}
                    label="Active conditions"
                    value={p.highRiskConditions.join(", ")}
                  />
                  <CriticalItem
                    icon={Pill}
                    label="Current medications"
                    value={p.currentMedications.map((m) => m.name).join(", ")}
                  />
                  <CriticalItem
                    icon={UserRound}
                    label="Emergency contact"
                    value={p.emergencyContactMasked}
                    full
                  />
                </div>
              </div>

              {/* Warning */}
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-urgent/20 bg-urgent-muted/50 px-3.5 py-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-urgent" />
                <p className="text-xs leading-relaxed text-foreground">
                  This action is logged to the patient&apos;s audit trail with
                  your identity, facility and timestamp. Use only in genuine
                  emergencies.
                </p>
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                This is a prototype workflow and does not represent a real-world
                emergency regulation.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row-reverse">
              <Button
                onClick={handleConfirm}
                disabled={!reason}
                className="w-full bg-urgent text-urgent-foreground hover:bg-urgent/90 sm:w-auto"
              >
                <ShieldAlert className="size-4" />
                Confirm Emergency Access
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CriticalItem({
  icon: Icon,
  label,
  value,
  tone,
  full,
}: {
  icon: typeof UserRound
  label: string
  value: string
  tone?: "urgent"
  full?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-background p-3",
        full && "sm:col-span-2",
        tone === "urgent" ? "border-urgent/20" : "border-border",
      )}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon
          className={cn("size-3.5", tone === "urgent" && "text-urgent")}
        />
        {label}
      </div>
      <p
        className={cn(
          "mt-1 text-sm font-medium text-foreground text-pretty",
          tone === "urgent" && "text-urgent",
        )}
      >
        {value}
      </p>
    </div>
  )
}
