import {
  QrCode,
  Send,
  ShieldAlert,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"

import { dashboardKpis } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap = {
  scanned: QrCode,
  referrals: Send,
  "high-risk": ShieldAlert,
  "follow-ups": CalendarClock,
} as const

const accentMap = {
  scanned: "bg-teal-muted text-teal",
  referrals: "bg-accent text-accent-foreground",
  "high-risk": "bg-urgent-muted text-urgent",
  "follow-ups": "bg-warning-muted text-warning-foreground",
} as const

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus }

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardKpis.map((kpi) => {
        const Icon = iconMap[kpi.key as keyof typeof iconMap]
        const Trend = trendIcon[kpi.trend]
        return (
          <div
            key={kpi.key}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  accentMap[kpi.key as keyof typeof accentMap],
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Trend className="size-3.5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {kpi.value}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {kpi.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{kpi.delta}</p>
          </div>
        )
      })}
    </div>
  )
}
