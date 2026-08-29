"use client"

import Link from "next/link"
import { ArrowRight, CircleCheck as CheckCircle2, Clock, Send, Stethoscope } from "lucide-react"

import { useReferrals, statusBadgeLabels } from "@/lib/referral-store"
import { referrals as staticReferrals, priorityConfig } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function ReferralsPage() {
  const storedReferrals = useReferrals()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Send className="size-5.5" />
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Referrals
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Transfer patients across the care network with full medical context.
          </p>
        </div>
        <Link href="/referrals/new">
          <Button>
            <Send className="size-4" />
            New Referral
          </Button>
        </Link>
      </div>

      {/* Active referrals from store */}
      {storedReferrals.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Active referrals
          </h2>
          <ul className="flex flex-col gap-3">
            {storedReferrals.map((r) => {
              const cfg = priorityConfig[r.priority]
              return (
                <li key={r.id}>
                  <Link
                    href={`/referrals/${r.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Stethoscope className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {r.patientName}
                        </p>
                        <span className="font-mono text-xs text-muted-foreground">
                          {r.id}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="truncate">{r.fromFacility}</span>
                        <ArrowRight className="size-3 shrink-0" />
                        <span className="truncate">{r.toFacility}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {r.reason}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          cfg.className,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                        {cfg.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-muted px-2.5 py-0.5 text-[11px] font-medium text-success">
                        <CheckCircle2 className="size-3" />
                        {statusBadgeLabels[r.status]}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Other referrals (static demo data) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Other referrals in the network
        </h2>
        <ul className="flex flex-col gap-3">
          {staticReferrals.map((r) => {
            const cfg = priorityConfig[r.priority]
            const statusLabel: Record<string, string> = {
              pending: "Pending",
              accepted: "Accepted",
              "in-transit": "In transit",
              completed: "Completed",
            }
            return (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Clock className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {r.patientName}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="truncate">{r.from}</span>
                    <ArrowRight className="size-3 shrink-0" />
                    <span className="truncate">{r.to}</span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.reason}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      cfg.className,
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {statusLabel[r.status]} · {r.raisedAt}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {storedReferrals.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Send className="size-5" />
          </span>
          <h2 className="mt-3 text-base font-semibold text-foreground">
            No active referrals yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
            Create a referral from the consultation workflow or the dashboard
            quick actions to see it tracked here.
          </p>
          <Link
            href="/referrals/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Send className="size-4" />
            Create Referral
          </Link>
        </div>
      )}
    </div>
  )
}
