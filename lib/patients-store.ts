"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Patient, RiskLevel } from "@/lib/mock-data"

export interface PatientRow extends Patient {}

function mapRow(r: Record<string, unknown>): PatientRow {
  return {
    id: r.id as string,
    swasthyaId: r.swasthya_id as string,
    name: r.name as string,
    age: r.age as number,
    gender: r.gender as Patient["gender"],
    primaryConcern: r.primary_concern as string,
    risk: r.risk as RiskLevel,
    lastActivity: r.last_activity as string ?? "",
    lastVisitFacility: r.last_visit_facility as string,
    phone: r.phone as string,
    village: r.village as string,
    bloodGroup: r.blood_group as string,
    lastVisit: r.last_visit as string,
    activeReferral: (r.active_referral as string | null) ?? null,
    followUpDue: r.follow_up_due as boolean,
    recentlyScanned: r.recently_scanned as boolean,
  }
}

export function usePatients() {
  const [items, setItems] = useState<PatientRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: true })
      if (!active) return
      if (error) {
        console.error("Failed to load patients:", error.message)
        setLoading(false)
        return
      }
      setItems((data ?? []).map(mapRow))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return { patients: items, loading }
}

export async function fetchPatientBySwasthyaId(swasthyaId: string): Promise<PatientRow | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("swasthya_id", swasthyaId)
    .maybeSingle()
  if (error) {
    console.error("Failed to fetch patient:", error.message)
    return null
  }
  return data ? mapRow(data) : null
}
