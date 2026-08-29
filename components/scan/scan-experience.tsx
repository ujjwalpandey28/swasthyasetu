"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Fingerprint,
  Hospital,
  IdCard,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"

import {
  currentUser,
  normalizeSwasthyaId,
  scanDemoPatient,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScannerFrame } from "@/components/scan/scanner-frame"
import { EmergencyAccessModal } from "@/components/scan/emergency-access-modal"

type Step = "idle" | "scanning" | "identity" | "verification" | "consent"

const STEP_ORDER: Step[] = [
  "scanning",
  "identity",
  "verification",
  "consent",
]

const STEP_LABELS: Record<Exclude<Step, "idle">, string> = {
  scanning: "Scanning",
  identity: "Identity",
  verification: "Access",
  consent: "Consent",
}

export function ScanExperience() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("idle")
  const [query, setQuery] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  function runSequence() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStep("scanning")
    timers.current.push(setTimeout(() => setStep("identity"), 1900))
    timers.current.push(setTimeout(() => setStep("verification"), 3400))
    timers.current.push(setTimeout(() => setStep("consent"), 4900))
  }

  function handleSimulate() {
    setSearchError(null)
    runSequence()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    if (
      normalizeSwasthyaId(query) === normalizeSwasthyaId(scanDemoPatient.swasthyaId)
    ) {
      setSearchError(null)
      runSequence()
    } else {
      setSearchError(
        `No patient found for “${query.trim()}”. Try ${scanDemoPatient.swasthyaId}.`,
      )
    }
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    setStep("idle")
    setQuery("")
    setSearchError(null)
  }

  function approveAccess() {
    router.push(`/patient/${scanDemoPatient.swasthyaId}`)
  }

  function confirmEmergency() {
    setEmergencyOpen(false)
    router.push(`/patient/${scanDemoPatient.swasthyaId}?access=emergency`)
  }

  const scannerState =
    step === "idle" ? "idle" : step === "scanning" ? "scanning" : "found"
  const showResults = step !== "idle" && step !== "scanning"

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: scanner + controls */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-center">
            <ScannerFrame state={scannerState} />
          </div>

          {step === "idle" && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-success-muted px-3 py-2 text-sm font-medium text-success">
              <span className="size-2 rounded-full bg-success" />
              Ready to Scan
            </div>
          )}

          {step === "scanning" && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-teal-muted px-3 py-2 text-sm font-medium text-teal">
              <Sparkles className="size-4" />
              Reading secure QR code…
            </div>
          )}

          <Button
            size="lg"
            onClick={handleSimulate}
            disabled={step === "scanning"}
            className="w-full"
          >
            <Fingerprint className="size-4" />
            {step === "idle" ? "Simulate Patient QR Scan" : "Re-scan Patient QR"}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <label
              htmlFor="swasthya-search"
              className="text-sm font-medium text-foreground"
            >
              Search by Swasthya ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="swasthya-search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSearchError(null)
                  }}
                  placeholder="SWA-9284-1829"
                  spellCheck={false}
                  autoComplete="off"
                  className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <Button type="submit" variant="outline">
                Look up
              </Button>
            </div>
            {searchError && (
              <p className="text-xs text-urgent">{searchError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Prototype only — no camera permission required.
            </p>
          </form>
        </div>

        {/* Right: stepper + results */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <Stepper current={step} />

          <div className="min-h-0 flex-1">
            {step === "idle" && <IdlePanel />}
            {step === "scanning" && <ScanningSkeleton />}
            {showResults && (
              <div className="flex flex-col gap-4">
                <IdentityCard />
                {(step === "verification" || step === "consent") && (
                  <VerificationCard />
                )}
                {step === "consent" && (
                  <ConsentCard
                    onApprove={approveAccess}
                    onEmergency={() => setEmergencyOpen(true)}
                    onReset={reset}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <EmergencyAccessModal
        open={emergencyOpen}
        patientName={scanDemoPatient.name}
        onClose={() => setEmergencyOpen(false)}
        onConfirm={confirmEmergency}
      />
    </>
  )
}

function Stepper({ current }: { current: Step }) {
  const activeIndex = current === "idle" ? -1 : STEP_ORDER.indexOf(current)
  return (
    <ol className="flex items-center gap-1.5">
      {STEP_ORDER.map((s, i) => {
        const done = activeIndex > i
        const active = activeIndex === i
        return (
          <li key={s} className="flex flex-1 items-center gap-1.5">
            <div className="flex flex-1 flex-col gap-1.5">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  done || active ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium transition-colors",
                  done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {done && <CheckCircle2 className="size-3 text-primary" />}
                {STEP_LABELS[s]}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function IdlePanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-teal-muted text-teal">
        <IdCard className="size-6" />
      </span>
      <h3 className="mt-3 text-base font-semibold text-foreground">
        No patient loaded
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        Scan a patient&apos;s Swasthya QR or search by ID. Verified identity,
        access checks and consent appear here.
      </p>
    </div>
  )
}

function ScanningSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center gap-4">
          <div className="size-14 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="space-y-2.5 rounded-xl border border-border p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

function IdentityCard() {
  const p = scanDemoPatient
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-success/30 bg-success-muted/40 p-4 duration-500">
      <div className="flex items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-card text-teal ring-2 ring-teal/30">
          <UserRound className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {p.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified identity
            </span>
          </div>
          <p className="mt-0.5 font-mono text-sm text-foreground">
            {p.swasthyaId}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
            <Field label="Age" value={String(p.age)} />
            <Field label="Gender" value={p.gender} />
            <Field label="Blood" value={p.bloodGroup} />
            <Field label="Village" value={p.village} />
          </dl>
        </div>
      </div>
    </div>
  )
}

function VerificationCard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border p-4 duration-500">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-teal" />
        <h4 className="text-sm font-semibold text-foreground">
          Access verification
        </h4>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <VerifyItem
          icon={UserRound}
          label="Healthcare worker"
          value={currentUser.name}
        />
        <VerifyItem icon={Building2} label="Role" value={currentUser.role} />
        <VerifyItem
          icon={Hospital}
          label="Current facility"
          value={currentUser.facility}
        />
      </div>
    </div>
  )
}

function ConsentCard({
  onApprove,
  onEmergency,
  onReset,
}: {
  onApprove: () => void
  onEmergency: () => void
  onReset: () => void
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-primary/25 bg-accent/40 p-4 duration-500">
      <h4 className="text-base font-semibold text-foreground">
        Access Medical Summary?
      </h4>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">
        This QR initiates a secure, consent-based session to view{" "}
        {scanDemoPatient.name}&apos;s health summary. The code itself does not
        store the full medical record — it authorizes time-limited access that
        is logged to the patient&apos;s audit trail.
      </p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <Button onClick={onApprove} className="w-full sm:flex-1">
          Approve Access
        </Button>
        <Button
          variant="outline"
          onClick={onEmergency}
          className="w-full border-urgent/40 text-urgent hover:bg-urgent-muted sm:flex-1"
        >
          Emergency Access
        </Button>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Cancel and scan another patient
      </button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

function VerifyItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-foreground text-pretty">
        {value}
      </p>
    </div>
  )
}
