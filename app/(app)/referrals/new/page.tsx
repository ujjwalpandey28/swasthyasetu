"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react"

import {
  readPendingConsultation,
  clearPendingConsultation,
  saveConsultation,
} from "@/lib/consultation-store"
import { patientProfile, priorityConfig, ReferralPriority } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const facilityOptions = [
  "District Hospital, Bhilwara",
  "Community Health Centre, Mandalgarh",
  "Sub-Divisional Hospital, Shahpura",
  "Medical College, Udaipur",
] as const

const specialtyOptions = [
  "Cardiology",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "General Medicine",
  "Orthopaedics",
] as const

export default function NewReferralPage() {
  const router = useRouter()
  const [pending, setPending] = useState<ReturnType<typeof readPendingConsultation>>(null)
  const [loaded, setLoaded] = useState(false)

  const [toFacility, setToFacility] = useState<string>(facilityOptions[0])
  const [specialty, setSpecialty] = useState<string>(specialtyOptions[0])
  const [priority, setPriority] = useState<ReferralPriority>("urgent")
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = readPendingConsultation()
    setPending(p)
    if (p) {
      if (p.recommendedAction) setReason(p.recommendedAction)
      else if (p.diagnosis) setReason(p.diagnosis)
    }
    setLoaded(true)
  }, [])

  function handleSubmit() {
    setSaving(true)
    if (pending) {
      saveConsultation(pending)
      clearPendingConsultation()
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      router.push(`/patient/${patientProfile.swasthyaId}`)
    }, 1400)
  }

  if (!loaded) return null

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-success/25 bg-success-muted/30 px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-success text-success-foreground">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Referral created
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
          The consultation has been saved and a referral raised to{" "}
          {toFacility}. Taking you to the patient profile…
        </p>
        <Loader2 className="mt-4 size-5 animate-spin text-success" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/consultation/new"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to consultation
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Send className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create Referral
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Transfer {patientProfile.name} with full consultation context.
          </p>
        </div>
      </div>

      {pending && (
        <div className="rounded-2xl border border-teal/25 bg-teal-muted/30 p-5">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-teal" />
            <h4 className="text-sm font-semibold text-foreground">
              Carried from consultation
            </h4>
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail label="Diagnosis" value={pending.diagnosis || "—"} />
            <Detail label="Recommended action" value={pending.recommendedAction || "—"} />
            <Detail label="Symptoms" value={pending.symptoms.join(", ") || "—"} />
            <Detail label="Risk level" value={pending.riskLevel} />
          </dl>
          {pending.clinicalNotes && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">Clinical notes</p>
              <p className="mt-0.5 text-sm text-foreground text-pretty">
                {pending.clinicalNotes}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="From facility">
            <p className="text-sm font-medium text-foreground">
              {patientProfile.currentFacility}
            </p>
          </Field>
          <Field label="To facility">
            <select
              value={toFacility}
              onChange={(e) => setToFacility(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {facilityOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Specialty">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {specialtyOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <div className="flex gap-2">
              {(["emergency", "urgent", "routine"] as const).map((p) => {
                const cfg = priorityConfig[p]
                const active = priority === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-transparent " + cfg.className
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </Field>
        </div>

        <Field label="Reason for referral">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Chest discomfort with elevated blood pressure — specialist cardiac evaluation required."
            className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </Field>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/consultation/new")}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Raise Referral
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground capitalize text-pretty">
        {value}
      </p>
    </div>
  )
}
