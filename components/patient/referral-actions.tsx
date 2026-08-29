"use client"

import Link from "next/link"
import { Send, FileText } from "lucide-react"

import { useReferrals } from "@/lib/referral-store"
import { patientProfile } from "@/lib/mock-data"

export function PatientReferralActions() {
  const referrals = useReferrals()
  const patientReferrals = referrals.filter(
    (r) => r.patientSwasthyaId === patientProfile.swasthyaId,
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Send className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">Referrals</h2>
        </div>
        <Link
          href="/referrals/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <Send className="size-4" />
          Create Referral
        </Link>
      </div>

      {patientReferrals.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {patientReferrals.map((r) => (
            <li key={r.id}>
              <Link
                href={`/referrals/${r.id}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs font-medium text-foreground">
                      {r.id}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {r.specialty}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.fromFacility} → {r.toFacility}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-success-muted px-2.5 py-0.5 text-[11px] font-medium text-success">
                  {r.status === "follow-up" ? "Follow-up" : "Active"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No active referrals for this patient.
          </p>
        </div>
      )}
    </div>
  )
}
