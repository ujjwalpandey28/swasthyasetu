import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Droplet,
  FileText,
  MapPin,
  Phone,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from "lucide-react"

import {
  currentUser,
  normalizeSwasthyaId,
  scanDemoPatient,
} from "@/lib/mock-data"

export default async function PatientProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ swasthyaId: string }>
  searchParams: Promise<{ access?: string }>
}) {
  const { swasthyaId } = await params
  const { access } = await searchParams

  if (
    normalizeSwasthyaId(decodeURIComponent(swasthyaId)) !==
    normalizeSwasthyaId(scanDemoPatient.swasthyaId)
  ) {
    notFound()
  }

  const p = scanDemoPatient
  const isEmergency = access === "emergency"

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Link
        href="/scan"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to scanner
      </Link>

      {isEmergency && (
        <div className="flex items-start gap-3 rounded-xl border border-urgent/25 bg-urgent-muted/60 px-4 py-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-urgent" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Emergency access active
            </p>
            <p className="text-xs text-muted-foreground text-pretty">
              Only critical information is shown. This access has been logged to
              the patient&apos;s audit trail as {currentUser.name},{" "}
              {currentUser.facility}.
            </p>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-teal-muted text-teal ring-1 ring-teal/20">
            <UserRound className="size-8" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {p.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                <BadgeCheck className="size-3" />
                Verified
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {p.swasthyaId}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">{p.lastRecordUpdate}</p>
            <p className="text-xs text-muted-foreground">
              {p.linkedFacilities} linked facilities
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat icon={UserRound} label="Age / Gender" value={`${p.age} · ${p.gender}`} />
          <Stat icon={Droplet} label="Blood group" value={p.bloodGroup} />
          <Stat icon={MapPin} label="Village" value={p.village} />
          <Stat icon={Phone} label="Contact" value="On file" />
        </dl>
      </div>

      {/* Critical summary — always visible */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Critical summary
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SummaryRow label="Primary concern" value={p.primaryConcern} />
          <SummaryRow label="Allergies" value="No known drug allergies" />
          <SummaryRow label="Active medications" value="Metformin 500mg · Insulin (basal)" />
          <SummaryRow label="Recent alert" value="Elevated fasting glucose — 142 mg/dL" />
        </div>
      </section>

      {/* Full record — hidden under emergency access */}
      {isEmergency ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-urgent-muted text-urgent">
            <FileText className="size-5" />
          </span>
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Full history restricted
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground text-pretty">
            Consultations, lab history and documents require patient consent.
            Request standard access to view the complete record.
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Medical history
            </h2>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            <HistoryRow
              title="Antenatal consultation"
              detail="Glucose monitoring, insulin dose reviewed"
              time="20 min ago · Dhanwantri Nagar PHC"
            />
            <HistoryRow
              title="Lab results uploaded"
              detail="Fasting glucose 142 mg/dL, HbA1c 6.9%"
              time="2 days ago · District Lab, Bhilwara"
            />
            <HistoryRow
              title="Referral accepted"
              detail="High-risk pregnancy → CHC Mandalgarh"
              time="1 week ago · Dhanwantri Nagar PHC"
            />
          </ul>
        </section>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Profile shell — the complete patient record view is coming in a later
        step.
      </p>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground text-pretty">
        {value}
      </p>
    </div>
  )
}

function HistoryRow({
  title,
  detail,
  time,
}: {
  title: string
  detail: string
  time: string
}) {
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-background p-3.5">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-teal" />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground text-pretty">{detail}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
      </div>
    </li>
  )
}
