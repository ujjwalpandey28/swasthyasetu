"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  QrCode,
  Users,
  Stethoscope,
  Send,
  Building2,
  BarChart3,
  UserCircle,
  Activity,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scan Patient", href: "/scan", icon: QrCode },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "New Consultation", href: "/consultation/new", icon: Stethoscope },
  { label: "Referrals", href: "/referrals", icon: Send },
  { label: "Facility", href: "/facility", icon: Building2 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserCircle },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Activity className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            SwasthyaSetu
          </p>
          <p className="text-[11px] font-medium text-muted-foreground">
            Scan. Verify. Continue Care.
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-sidebar-foreground",
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {currentUser.initials}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
