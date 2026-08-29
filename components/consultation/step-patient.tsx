"use client"

import {
  AlertTriangle,
  BadgeCheck,
  Droplet,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from "lucide-react"

import { patientProfile, scanDemoPatient } from "@/lib/mock-data"

export function PatientStep() {
  const p = patientProfile
  const demo = scanDemoPatient
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-muted text-teal ring-1 ring-teal/20">
          <UserRound className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </span>
          </div>
          <p className="mt-0.5 font-mono text-sm text-muted-foreground">
            {p.swasthyaId}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {p.age} yrs · {p.gender} · Blood {p.bloodGroup} · {demo.village}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-urgent/25 bg-urgent-muted/40 p-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-urgent" />
          <h4 className="text-sm font-semibold text-foreground">
            Critical medical alerts
          </h4>
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

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-4 text-teal" />
          <h4 className="text-sm font-semibold text-foreground">
            Existing conditions
          </h4>
        </div>
        <ul className="mt-3 flex flex-col gap-2.5">
          {p.activeConditions.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.since}</p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {c.control}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h4 className="text-sm font-semibold text-foreground">
          Current medications
        </h4>
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
    </div>
  )
}
