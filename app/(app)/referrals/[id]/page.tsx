"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplet,
  FileText,
  HeartPulse,
  MapPin,
  Pill,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react"

import {
  stageOrder,
  stageLabels,
  statusBadgeLabels,
  useReferral,
  updateReferralStatus,
  ReferralStatus,
} from "@/lib/referral-store"
import { priorityConfig } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function ReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const referral = useReferral(id)

  if (!referral) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link
          href="/referrals"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to referrals
        </Link>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <FileText className="size-5" />
          </span>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Referral not found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
            This referral hasn&apos;t been created yet. Start by creating a new
            referral from the consultation workflow or dashboard.
          </p>
          <Link
            href="/referrals/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Send className="size-4" />
            Create Referral
          </Link>
        </div>
      </div>
    )
  }

  const cfg = priorityConfig[referral.priority]
  const currentIndex = stageOrder.indexOf(referral.status)
  const progress = ((currentIndex + 1) / stageOrder.length) * 100
  const nextStage = stageOrder[currentIndex + 1]

  function handleAdvance() {
    if (nextStage) {
      updateReferralStatus(referral!.id, nextStage as ReferralStatus)
    }
  }

  const mc = referral.medicalContext

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Link
        href="/referrals"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to referrals
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Send className="size-7" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Referral Journey
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">
                  {referral.id}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    cfg.className,
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-muted px-2.5 py-0.5 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3" />
                  {statusBadgeLabels[referral.status]}
                </span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="text-sm font-semibold text-foreground">
              {referral.patientName}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {referral.patientSwasthyaId}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Journey + Update */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Journey timeline */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Care Journey
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sub-Centre → PHC → District Hospital → Specialist Care
          </p>

          {/* Facility flow */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {["Sub-Centre", "Primary Health Centre", "District Hospital", "Specialist Care"].map(
              (f, i, arr) => (
                <div key={f} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 font-medium",
                      i <= Math.min(currentIndex + 1, arr.length - 1)
                        ? "bg-teal-muted text-teal"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {f}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight className="size-3 text-muted-foreground" />
                  )}
                </div>
              ),
            )}
          </div>

          {/* Vertical timeline */}
          <ol className="mt-6 flex flex-col gap-1">
            {referral.stages.map((stage, i) => {
              const isLast = i === referral.stages.length - 1
              return (
                <li key={stage.key} className="flex gap-4">
                  {/* Left rail */}
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        stage.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {stage.done ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Clock className="size-4" />
                      )}
                    </span>
                    {!isLast && (
                      <span
                        className={cn(
                          "my-1 w-0.5 flex-1",
                          stage.done ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("flex-1", isLast ? "pb-0" : "pb-5")}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          stage.done ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {stage.label}
                      </p>
                      {stage.done && (
                        <span className="rounded-full bg-success-muted px-2 py-0.5 text-[11px] font-medium text-success">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                      {stage.action}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3" />
                        {stage.facility}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <UserRound className="size-3" />
                        {stage.worker}
                      </span>
                      {stage.timestamp && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3" />
                          {stage.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Update status + activity */}
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Update Status
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Advance the referral to the next stage.
            </p>

            <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
              <p className="text-xs text-muted-foreground">Current status</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-muted px-2.5 py-1 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3" />
                  {statusBadgeLabels[referral.status]}
                </span>
              </div>
            </div>

            {nextStage ? (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Next stage</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {stageLabels[nextStage]}
                </p>
                <Button
                  onClick={handleAdvance}
                  className="mt-3 w-full"
                >
                  <ArrowRight className="size-4" />
                  Mark as {statusBadgeLabels[nextStage]}
                </Button>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-success/25 bg-success-muted/40 px-3.5 py-3">
                <CheckCircle2 className="size-4 text-success" />
                <p className="text-sm font-medium text-success">
                  Referral journey complete
                </p>
              </div>
            )}
          </section>

          {/* Activity feed */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Activity feed
            </h3>
            <ol className="mt-3 flex flex-col gap-2.5">
              {referral.stages
                .filter((s) => s.done)
                .reverse()
                .map((s) => (
                  <li
                    key={s.key}
                    className="flex gap-2.5 rounded-lg border border-border bg-background p-3"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-muted text-teal">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {s.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.worker} · {s.facility}
                      </p>
                      {s.timestamp && (
                        <p className="text-[11px] text-muted-foreground">
                          {s.timestamp}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Medical Context Sent */}
      <section className="rounded-2xl border border-teal/30 bg-card p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Medical Context Sent
          </h2>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
          The receiving facility can access this clinical context after
          appropriate identity verification. The patient does not need to
          repeat their history.
        </p>

        {/* Verification banner */}
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-success/25 bg-success-muted/30 px-4 py-3">
          <BadgeCheck className="size-4 text-success" />
          <p className="text-sm text-foreground">
            <span className="font-medium text-success">Verified:</span>{" "}
            Receiving facility identity confirmed. Clinical context unlocked.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Diagnosis */}
          <ContextCard icon={Stethoscope} title="Diagnosis">
            <p className="text-sm text-foreground text-pretty">{mc.diagnosis}</p>
          </ContextCard>

          {/* Recent vitals */}
          <ContextCard icon={HeartPulse} title="Recent vitals">
            <p className="text-sm text-foreground text-pretty">
              {mc.vitalsSummary}
            </p>
          </ContextCard>

          {/* Medications */}
          <ContextCard icon={Pill} title="Medications">
            <div className="flex flex-wrap gap-2">
              {mc.medications.map((m, i) => (
                <span
                  key={i}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </ContextCard>

          {/* Allergy */}
          <ContextCard icon={Droplet} title="Allergy">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-urgent px-3 py-1 text-xs font-medium text-urgent-foreground">
              <Droplet className="size-3" />
              {mc.allergy}
            </span>
          </ContextCard>

          {/* Test reports */}
          <ContextCard icon={ClipboardList} title="Test reports">
            <ul className="flex flex-col gap-1.5">
              {mc.testReports.map((t, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-foreground"
                >
                  <FileText className="size-3.5 text-muted-foreground" />
                  {t}
                </li>
              ))}
            </ul>
          </ContextCard>

          {/* Referring doctor's notes */}
          <ContextCard icon={UserRound} title="Referring doctor's notes">
            <p className="text-sm text-foreground text-pretty">
              {mc.referringDoctorNotes}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              — {referral.fromFacility}
            </p>
          </ContextCard>
        </div>

        {/* Additional referral details */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <DetailRow label="Reason for referral" value={referral.reason} />
          <DetailRow label="Treatment already provided" value={referral.treatmentProvided || "—"} />
          <DetailRow label="Required tests" value={referral.requiredTests || "—"} />
          <DetailRow label="Clinical notes" value={referral.clinicalNotes || "—"} />
        </div>
      </section>

      {/* Link to patient */}
      <Link
        href={`/patient/${referral.patientSwasthyaId}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        View patient profile
        <ChevronRight className="size-4" />
      </Link>
    </div>
  )
}

function ContextCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof UserRound
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5 text-teal" />
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground text-pretty">
        {value}
      </p>
    </div>
  )
}
