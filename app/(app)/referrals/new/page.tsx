"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Activity,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Droplet,
  HeartPulse,
  Lightbulb,
  Loader2,
  MapPin,
  Pill,
  Send,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from "lucide-react"

import {
  readPendingConsultation,
} from "@/lib/consultation-store"
import {
  createReferral,
  demoRecommendation,
  receivingFacilityOptions,
  specialtyOptions,
} from "@/lib/referral-store"
import { patientProfile, priorityConfig, ReferralPriority } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function NewReferralPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [hasPending, setHasPending] = useState(false)
  const [pendingDiagnosis, setPendingDiagnosis] = useState("")

  const [toFacility, setToFacility] = useState<string>(demoRecommendation.facility)
  const [specialty, setSpecialty] = useState<string>(demoRecommendation.department)
  const [priority, setPriority] = useState<ReferralPriority>("urgent")
  const [reason, setReason] = useState("")
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [treatmentProvided, setTreatmentProvided] = useState("")
  const [requiredTests, setRequiredTests] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const p = readPendingConsultation()
    if (p) {
      setHasPending(true)
      setPendingDiagnosis(p.diagnosis || "")
      if (p.recommendedAction) setReason(p.recommendedAction)
      else if (p.diagnosis) setReason(p.diagnosis)
      if (p.clinicalNotes) setClinicalNotes(p.clinicalNotes)
    }
    setLoaded(true)
  }, [])

  function handleSubmit() {
    setSaving(true)
    createReferral({
      toFacility,
      specialty,
      priority,
      reason,
      clinicalNotes,
      treatmentProvided,
      requiredTests,
    })
    setSaving(false)
    setTimeout(() => {
      router.push(`/referrals/REF-847293`)
    }, 600)
  }

  if (!loaded) return null

  const p = patientProfile

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Link
        href="/consultation/new"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
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
            The medical context travels securely — {p.name} won&apos;t need to
            repeat their history.
          </p>
        </div>
      </div>

      {hasPending && (
        <div className="flex items-center gap-2.5 rounded-xl border border-teal/25 bg-teal-muted/30 px-4 py-3">
          <Stethoscope className="size-4 shrink-0 text-teal" />
          <p className="text-sm text-foreground">
            Consultation context detected
            {pendingDiagnosis && (
              <>
                {" "}— <span className="font-medium">{pendingDiagnosis}</span>
              </>
            )}
            . It will be attached to this referral automatically.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* Left: Patient Context panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">
                Patient Context
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Travels securely with the referral
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-teal-muted text-teal">
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  <BadgeCheck className="size-3.5 text-success" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {p.swasthyaId}
                </p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2.5">
              <ContextField label="Age" value={`${p.age} yrs`} />
              <ContextField label="Gender" value={p.gender} />
              <ContextField label="Blood Group" value={p.bloodGroup} />
              <ContextField label="Village" value={p.village} />
            </dl>
          </div>

          {/* Critical alerts */}
          <div className="rounded-2xl border border-urgent/25 bg-urgent-muted/40 p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-urgent" />
              <h3 className="text-sm font-semibold text-foreground">
                Critical alerts
            </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 rounded-full bg-urgent px-3 py-1 text-xs font-medium text-urgent-foreground"
                >
                  <AlertTriangle className="size-3" />
                  Allergy · {a}
                </span>
              ))}
              {p.highRiskConditions.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full bg-warning-muted px-3 py-1 text-xs font-medium text-warning-foreground"
                >
                  <Droplet className="size-3" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Active conditions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Active conditions
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {p.activeConditions.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    {c.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{c.control}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current medications */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Pill className="size-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">
                Current medications
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.currentMedications.map((m) => (
                <span
                  key={m.name}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {m.name} · {m.dose}
                </span>
              ))}
            </div>
          </div>

          {/* Recent vitals */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <HeartPulse className="size-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">
                Recent vitals
              </h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {p.vitals.map((v) => (
                <div
                  key={v.key}
                  className="rounded-lg border border-border bg-background p-2.5"
                >
                  <p className="text-[11px] text-muted-foreground">{v.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {v.value}
                    <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                      {v.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Referral form */}
        <div className="flex flex-col gap-5">
          {/* Recommendation card */}
          <div className="rounded-2xl border border-teal/30 bg-teal-muted/20 p-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">
                Prototype Recommendation
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Demo suggestion — not real live healthcare data.
            </p>

            <div className="mt-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Recommended: {demoRecommendation.facility}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {demoRecommendation.department} Department
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setToFacility(demoRecommendation.facility)
                    setSpecialty(demoRecommendation.department)
                  }}
                  className="shrink-0 rounded-lg border border-teal/40 bg-teal-muted/50 px-3 py-1.5 text-xs font-medium text-teal transition-colors hover:bg-teal-muted"
                >
                  Apply
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-muted px-2.5 py-1 font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Available now
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
                  <Clock className="size-3" />
                  Est. queue {demoRecommendation.queueEstimate}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                  <MapPin className="size-3" />
                  {demoRecommendation.distance} away
                </span>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Referring facility">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {p.currentFacility}
                  </span>
                </div>
              </Field>
              <Field label="Receiving facility">
                <select
                  value={toFacility}
                  onChange={(e) => setToFacility(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  {receivingFacilityOptions.map((f) => (
                    <option key={f} value={f}>{f}</option>
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
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <div className="flex gap-2">
                  {(["emergency", "urgent", "routine"] as const).map((pr) => {
                    const cfg = priorityConfig[pr]
                    const active = priority === pr
                    return (
                      <button
                        key={pr}
                        type="button"
                        onClick={() => setPriority(pr)}
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

            <div className="mt-4">
              <Field label="Reason for referral">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Chest discomfort with elevated blood pressure — specialist cardiac evaluation required."
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Clinical notes">
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  placeholder="Patient reports intermittent chest discomfort over two weeks. BP elevated at 148/92. Continue Amlodipine 5 mg."
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Treatment already provided">
                <textarea
                  value={treatmentProvided}
                  onChange={(e) => setTreatmentProvided(e.target.value)}
                  rows={2}
                  placeholder="Amlodipine 5 mg continued. Salt restriction advised."
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </Field>
              <Field label="Required tests">
                <textarea
                  value={requiredTests}
                  onChange={(e) => setRequiredTests(e.target.value)}
                  rows={2}
                  placeholder="ECG, Echocardiography, Lipid profile"
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="size-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Raise Referral
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
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

function ContextField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
