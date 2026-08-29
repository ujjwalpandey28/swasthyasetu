import Link from "next/link"
import { QrCode, UserPlus, Stethoscope, Send, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const actions = [
  {
    label: "Scan Patient QR",
    description: "Verify identity & open record",
    href: "/scan",
    icon: QrCode,
    className: "bg-primary text-primary-foreground",
    primary: true,
  },
  {
    label: "Register New Patient",
    description: "Issue a new Swasthya ID",
    href: "/patients",
    icon: UserPlus,
    className: "bg-card text-foreground",
    primary: false,
  },
  {
    label: "Start Consultation",
    description: "Record a new visit",
    href: "/consultation/new",
    icon: Stethoscope,
    className: "bg-card text-foreground",
    primary: false,
  },
  {
    label: "Create Referral",
    description: "Transfer to another facility",
    href: "/referrals/new",
    icon: Send,
    className: "bg-card text-foreground",
    primary: false,
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              "group flex flex-col justify-between gap-6 rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
              action.primary
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/30",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  action.primary
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-teal-muted text-teal",
                )}
              >
                <Icon className="size-5" />
              </span>
              <ArrowUpRight
                className={cn(
                  "size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  action.primary
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold">{action.label}</p>
              <p
                className={cn(
                  "text-xs",
                  action.primary
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {action.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
