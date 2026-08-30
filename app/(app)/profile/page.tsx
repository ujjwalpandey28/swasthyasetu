import { Activity, BadgeCheck, Building2, Check, Clock, FileText, Heart, HeartPulse, ShieldCheck, Stethoscope, CircleUser as UserCircle, UserRound, X } from "lucide-react"

import {
  accessLog,
  currentUser,
  rolePermissions,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, typeof Heart> = {
  Heart,
  Stethoscope,
  Building2,
}

const logTypeConfig: Record<string, { className: string; icon: typeof Activity }> = {
  access: { className: "bg-teal-muted text-teal", icon: UserRound },
  consent: { className: "bg-success-muted text-success", icon: BadgeCheck },
  referral: { className: "bg-accent text-accent-foreground", icon: FileText },
  consultation: { className: "bg-success-muted text-success", icon: Stethoscope },
  emergency: { className: "bg-urgent-muted text-urgent", icon: ShieldCheck },
}

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <UserCircle className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Worker credentials, role &amp; access permissions
          </p>
        </div>
      </div>

      {/* User card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
            {currentUser.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {currentUser.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                <BadgeCheck className="size-3" />
                Verified
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {currentUser.role} · {currentUser.facilityType}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon={Stethoscope} label="Role" value={currentUser.role} />
          <InfoTile icon={Building2} label="Facility" value={currentUser.facility} />
          <InfoTile
            icon={ShieldCheck}
            label="Verification"
            value="Verified & Active"
            valueClass="text-success"
          />
          <InfoTile
            icon={Activity}
            label="Access level"
            value="Full clinical access"
          />
        </dl>
      </div>

      {/* Role-based access explanation */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Role-Based Access Permissions
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Each role in the SwasthyaSetu network has scoped permissions. Your
          current role is highlighted.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rolePermissions.map((rp) => {
            const Icon = iconMap[rp.icon] ?? Heart
            return (
              <div
                key={rp.roleType}
                className={cn(
                  "rounded-xl border p-5 transition-all",
                  rp.current
                    ? "border-primary/40 bg-accent/30 shadow-sm"
                    : "border-border bg-background",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      rp.current
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {rp.current && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                      <Check className="size-3" />
                      Your role
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {rp.role}
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {rp.permissions.map((perm) => (
                    <li
                      key={perm}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 size-3.5 shrink-0",
                          rp.current ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Access Log */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-teal" />
          <h2 className="text-base font-semibold text-foreground">
            Access Log
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Recent actions recorded to the audit trail during this session.
        </p>

        <ol className="mt-5 flex flex-col gap-3">
          {accessLog.map((entry, i) => {
            const cfg = logTypeConfig[entry.type] ?? logTypeConfig.access
            const Icon = cfg.icon
            const last = i === accessLog.length - 1
            return (
              <li key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      cfg.className,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {!last && <span className="my-1 w-px flex-1 bg-border" />}
                </div>
                <div className={cn("pb-3 pt-1.5", last && "pb-0")}>
                  <p className="text-sm font-medium text-foreground">
                    {entry.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.detail}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {entry.time} · Today
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Session info */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <HeartPulse className="size-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Session active · All actions are logged to the patient audit trail
          with your identity, facility and timestamp.
        </p>
      </div>
    </div>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof UserRound
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className={cn("mt-1 text-sm font-medium text-foreground text-pretty", valueClass)}>
        {value}
      </p>
    </div>
  )
}
