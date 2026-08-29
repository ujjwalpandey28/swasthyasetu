"use client"

import Link from "next/link"
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react"

import { useReferrals, statusBadgeLabels } from "@/lib/referral-store"
import { referrals as staticReferrals, priorityConfig } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function ReferralStatus() {
  const storedReferrals = useReferrals()

  // Merge stored + static for counting
  const allReferrals = [
    ...storedReferrals.map((r) => ({
      id: r.id,
      patientName: r.patientName,
      priority: r.priority,
      from: r.fromFacility,
      to: r.toFacility,
      reason: r.reason,
      status: r.status === "follow-up" ? "completed" : "accepted",
      raisedAt: r.createdAtLabel,
      href: `/referrals/${r.id}`,
    })),
    ...staticReferrals.map((r) => ({
      ...r,
      href: "/referrals",
    })),
  ]

  const counts = {
    emergency: allReferrals.filter((r) => r.priority === "emergency").length,
    urgent: allReferrals.filter((r) => r.priority === "urgent").length,
    routine: allReferrals.filter((r) => r.priority === "routine").length,
  }

  const statusLabel: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    "in-transit": "In transit",
    completed: "Completed",
  }

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Active Referral Status
          </h2>
          <p className="text-xs text-muted-foreground">
            Live transfers across the care network
          </p>
        </div>
        <Link
          href="/referrals"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Manage
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        {(["emergency", "urgent", "routine"] as const).map((key) => (
          <div
            key={key}
            className={cn(
              "rounded-xl px-3 py-2.5 text-center",
              priorityConfig[key].className,
            )}
          >
            <p className="text-xl font-semibold">{counts[key]}</p>
            <p className="text-[11px] font-medium capitalize">{key}</p>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {allReferrals.slice(0, 5).map((r) => {
          const cfg = priorityConfig[r.priority]
          return (
            <li key={r.id} className="px-5 py-3">
              <Link href={r.href} className="block transition-colors hover:opacity-80">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {r.patientName}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      cfg.className,
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate">{r.from}</span>
                  <ArrowRight className="size-3 shrink-0" />
                  <span className="truncate">{r.to}</span>
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="truncate text-xs text-muted-foreground">
                    {r.reason}
                  </p>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    {r.status === "completed" && (
                      <CheckCircle2 className="size-3 text-success" />
                    )}
                    {statusLabel[r.status]} · {r.raisedAt}
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
