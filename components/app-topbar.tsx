"use client"

import { Search, Bell, ChevronDown, Building2 } from "lucide-react"

import { currentUser } from "@/lib/mock-data"

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Facility */}
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-1.5">
        <span className="flex size-7 items-center justify-center rounded-md bg-teal-muted text-teal">
          <Building2 className="size-4" />
        </span>
        <div className="hidden leading-tight sm:block">
          <p className="text-[11px] font-medium text-muted-foreground">
            Current facility
          </p>
          <p className="max-w-52 truncate text-sm font-semibold text-foreground">
            {currentUser.facility}
          </p>
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </div>

      {/* Search */}
      <div className="relative ml-auto hidden max-w-md flex-1 items-center md:flex">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search patients, Swasthya ID, referrals…"
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        {/* Date */}
        <span className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground lg:inline-flex">
          {todayLabel()}
        </span>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4.5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-urgent ring-2 ring-card" />
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="Account"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          {currentUser.initials}
        </button>
      </div>
    </header>
  )
}
