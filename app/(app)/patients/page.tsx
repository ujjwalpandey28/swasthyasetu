"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Search, Users, Filter } from "lucide-react"

import { patients, riskConfig } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type FilterKey = "all" | "high-risk" | "active-referral" | "follow-up" | "recently-scanned"

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Patients" },
  { key: "high-risk", label: "High Risk" },
  { key: "active-referral", label: "Active Referral" },
  { key: "follow-up", label: "Follow-Up Due" },
  { key: "recently-scanned", label: "Recently Scanned" },
]

export default function PatientsPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  const filtered = useMemo(() => {
    let list = patients
    if (activeFilter === "high-risk") list = list.filter((p) => p.risk === "high")
    if (activeFilter === "active-referral") list = list.filter((p) => p.activeReferral !== null)
    if (activeFilter === "follow-up") list = list.filter((p) => p.followUpDue)
    if (activeFilter === "recently-scanned") list = list.filter((p) => p.recentlyScanned)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.swasthyaId.toLowerCase().includes(q) ||
          p.primaryConcern.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q),
      )
    }
    return list
  }, [query, activeFilter])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <Users className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Patients
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Longitudinal records across the care network
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, Swasthya ID, concern, or village…"
            className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                activeFilter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {patients.length} patients
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Swasthya ID</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Risk Status</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Current Referral</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const risk = riskConfig[p.risk]
                return (
                  <tr
                    key={p.id}
                    className="group transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                          {p.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.primaryConcern}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.swasthyaId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {p.age}y · {p.gender}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          risk.className,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", risk.dot)} />
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.lastVisit}
                    </td>
                    <td className="px-4 py-3">
                      {p.activeReferral ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          {p.activeReferral}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/patient/${p.swasthyaId}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        View
                        <ChevronRight className="size-3.5 text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="size-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">
              No patients found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
