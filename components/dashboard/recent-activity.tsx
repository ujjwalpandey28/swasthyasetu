"use client"

import { useEffect, useState } from "react"
import {
  QrCode,
  Send,
  FlaskConical,
  Stethoscope,
  UserPlus,
} from "lucide-react"

import { recentActivity as staticActivity } from "@/lib/mock-data"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const config = {
  scan: { icon: QrCode, className: "bg-teal-muted text-teal" },
  referral: { icon: Send, className: "bg-urgent-muted text-urgent" },
  lab: { icon: FlaskConical, className: "bg-accent text-accent-foreground" },
  consultation: {
    icon: Stethoscope,
    className: "bg-success-muted text-success",
  },
  registration: {
    icon: UserPlus,
    className: "bg-warning-muted text-warning-foreground",
  },
} as const

interface ActivityRow {
  id: string
  type: keyof typeof config
  title: string
  detail: string
  time: string
}

export function RecentActivity() {
  const [items, setItems] = useState<ActivityRow[]>(staticActivity)

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)
      if (!active || error || !data) return
      const rows: ActivityRow[] = data.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        type: r.type as ActivityRow["type"],
        title: r.title as string,
        detail: r.detail as string,
        time: r.time as string,
      }))
      if (rows.length > 0) setItems(rows)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>
        <p className="text-xs text-muted-foreground">
          Latest events across your facility
        </p>
      </div>

      <ol className="px-5 py-2">
        {items.map((item, i) => {
          const cfg = config[item.type]
          const Icon = cfg.icon
          const last = i === items.length - 1
          return (
            <li key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    cfg.className,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {!last && <span className="my-1 w-px flex-1 bg-border" />}
              </div>
              <div className={cn("pb-4 pt-1", last && "pb-2")}>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.time}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
