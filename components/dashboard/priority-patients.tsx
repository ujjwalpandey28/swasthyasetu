import Link from "next/link"
import { ChevronRight, Clock } from "lucide-react"

import { patients, riskConfig } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function PriorityPatients() {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Priority Patients
          </h2>
          <p className="text-xs text-muted-foreground">
            Patients needing attention at your facility today
          </p>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {patients.map((p) => {
          const risk = riskConfig[p.risk]
          return (
            <li
              key={p.id}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {p.age}y · {p.gender}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {p.primaryConcern}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {p.lastActivity}
                </p>
              </div>

              <span
                className={cn(
                  "hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex",
                  risk.className,
                )}
              >
                <span className={cn("size-1.5 rounded-full", risk.dot)} />
                {risk.label}
              </span>

              <Link
                href="/patients"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                View
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
