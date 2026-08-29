"use client"

import { useConsultations } from "@/lib/consultation-store"
import { scanDemoPatient } from "@/lib/mock-data"

export function LatestActivityIndicator() {
  const items = useConsultations(scanDemoPatient.swasthyaId)
  const latest = items[0]

  const label = latest
    ? `Updated just now · ${latest.facility}`
    : scanDemoPatient.lastRecordUpdate

  return (
    <div className="text-left sm:text-right">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        {scanDemoPatient.linkedFacilities} linked facilities
      </p>
    </div>
  )
}
