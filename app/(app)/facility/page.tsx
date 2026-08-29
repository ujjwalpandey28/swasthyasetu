import {
  Activity,
  BedDouble,
  Building2,
  ClipboardList,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react"

import {
  availableDoctors,
  bedStatus,
  currentUser,
  currentQueue,
  diagnosticAvailability,
  medicineStock,
  referralCapacity,
  StockLevel,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stockConfig: Record<StockLevel, { label: string; className: string; dot: string }> = {
  available: { label: "Available", className: "bg-success-muted text-success", dot: "bg-success" },
  low: { label: "Low Stock", className: "bg-warning-muted text-warning-foreground", dot: "bg-warning" },
  unavailable: { label: "Unavailable", className: "bg-urgent-muted text-urgent", dot: "bg-urgent" },
}

const doctorStatusConfig: Record<string, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-success-muted text-success" },
  busy: { label: "Busy", className: "bg-warning-muted text-warning-foreground" },
  "off-duty": { label: "Off-duty", className: "bg-muted text-muted-foreground" },
}

const queueStatusConfig: Record<string, { label: string; className: string }> = {
  waiting: { label: "Waiting", className: "bg-warning-muted text-warning-foreground" },
  "in-progress": { label: "In progress", className: "bg-teal-muted text-teal" },
  ready: { label: "Ready", className: "bg-success-muted text-success" },
}

export default function FacilityPage() {
  const totalBeds = bedStatus.reduce((s, b) => s + b.total, 0)
  const occupiedBeds = bedStatus.reduce((s, b) => s + b.occupied, 0)
  const availableBeds = totalBeds - occupiedBeds

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <Building2 className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Facility
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {currentUser.facility}
          </p>
        </div>
      </div>

      {/* Current Facility Status — KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatusCard
          icon={Users}
          label="Current Queue"
          value={`${currentQueue.length}`}
          sub={`${currentQueue.filter((q) => q.status === "waiting").length} waiting`}
          accent="bg-accent text-accent-foreground"
        />
        <StatusCard
          icon={Stethoscope}
          label="Available Doctors"
          value={`${availableDoctors.filter((d) => d.status === "available").length}/${availableDoctors.length}`}
          sub="On duty now"
          accent="bg-teal-muted text-teal"
        />
        <StatusCard
          icon={BedDouble}
          label="Available Beds"
          value={`${availableBeds}`}
          sub={`${occupiedBeds}/${totalBeds} occupied`}
          accent="bg-success-muted text-success"
        />
        <StatusCard
          icon={ClipboardList}
          label="Diagnostics"
          value={`${diagnosticAvailability.filter((d) => d.level === "available").length}/${diagnosticAvailability.length}`}
          sub="Services available"
          accent="bg-warning-muted text-warning-foreground"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Current Queue */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Current Queue
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Patients waiting for consultation
          </p>

          <ul className="mt-4 flex flex-col gap-2.5">
            {currentQueue.map((q, i) => {
              const cfg = queueStatusConfig[q.status]
              return (
                <li
                  key={q.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.concern}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {q.waitMin} min
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        cfg.className,
                      )}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Available Doctors */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Available Doctors
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Medical staff on duty
          </p>

          <ul className="mt-4 flex flex-col gap-2.5">
            {availableDoctors.map((d) => {
              const cfg = doctorStatusConfig[d.status]
              return (
                <li
                  key={d.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.specialty}
                      {d.currentPatient && ` · with ${d.currentPatient}`}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      cfg.className,
                    )}
                  >
                    {cfg.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Available Beds */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BedDouble className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Available Beds
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Bed capacity by ward
          </p>

          {/* Overall bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Overall occupancy</span>
              <span>{Math.round((occupiedBeds / totalBeds) * 100)}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(occupiedBeds / totalBeds) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {bedStatus.map((b) => (
              <div
                key={b.type}
                className="rounded-xl border border-border bg-background p-3"
              >
                <p className="text-xs font-medium text-muted-foreground">{b.type}</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold text-foreground">
                    {b.available}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {b.total} available
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      b.available === 0
                        ? "bg-urgent"
                        : b.available <= 1
                          ? "bg-warning"
                          : "bg-success",
                    )}
                    style={{ width: `${(b.occupied / b.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Referral Capacity */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-teal" />
            <h2 className="text-base font-semibold text-foreground">
              Referral Capacity
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Incoming and outgoing referral statistics
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {referralCapacity.map((r) => (
              <div
                key={r.direction}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
                      r.direction === "outgoing"
                        ? "bg-teal-muted text-teal"
                        : "bg-accent text-accent-foreground",
                    )}
                  >
                    {r.direction}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {r.total} total
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-sm font-semibold text-foreground">{r.pending}</p>
                    <p className="text-[10px] text-muted-foreground">Pending</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-sm font-semibold text-foreground">{r.accepted}</p>
                    <p className="text-[10px] text-muted-foreground">Accepted</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-sm font-semibold text-foreground">{r.completed}</p>
                    <p className="text-[10px] text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Medicine Availability — full width table */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Pill className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Medicine Availability
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Current stock levels for essential medicines
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Medicine</th>
                <th className="px-4 py-2.5">Quantity</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {medicineStock.map((m) => {
                const cfg = stockConfig[m.level]
                return (
                  <tr key={m.name} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.quantity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          cfg.className,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Diagnostic Availability */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <HeartPulse className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Diagnostic Availability
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Available diagnostic services at this facility
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {diagnosticAvailability.map((d) => {
            const cfg = stockConfig[d.level]
            return (
              <div
                key={d.name}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
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
                <p className="mt-1.5 text-xs text-muted-foreground text-pretty">
                  {d.note}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatusCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof UserRound
  label: string
  value: string
  sub: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-xl",
          accent,
        )}
      >
        <Icon className="size-5" />
      </span>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
