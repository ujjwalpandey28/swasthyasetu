"use client"

// Shared consultation store: types + localStorage persistence + risk logic.
// Used by the consultation flow, the patient profile (timeline), and the
// referral creation page so the QR scan → consultation → referral journey
// stays connected.

import { useEffect, useState } from "react"

import { currentUser, patientProfile } from "@/lib/mock-data"
import { supabase } from "@/lib/supabase"

export interface ConsultationVitals {
  bpSystolic: string
  bpDiastolic: string
  heartRate: string
  temperature: string
  weight: string
  bloodGlucose: string
  oxygenSaturation: string
}

export interface ConsultationMedication {
  id: string
  name: string
  dosage: string
  frequency: string
}

export interface SavedConsultation {
  id: string
  patientSwasthyaId: string
  patientName: string
  date: string // ISO
  dateLabel: string
  facility: string
  facilityType: string
  vitals: ConsultationVitals
  symptoms: string[]
  notes: string
  diagnosis: string
  clinicalNotes: string
  recommendedAction: string
  medications: ConsultationMedication[]
  riskLevel: RiskLevel
  createdAt: number
}

export type RiskLevel = "stable" | "moderate" | "high"

export const emptyVitals: ConsultationVitals = {
  bpSystolic: "",
  bpDiastolic: "",
  heartRate: "",
  temperature: "",
  weight: "",
  bloodGlucose: "",
  oxygenSaturation: "",
}

export const symptomOptions = [
  "Chest Discomfort",
  "Headache",
  "Dizziness",
  "Fatigue",
  "Other",
] as const

const STORAGE_KEY = "swasthyasetu:consultations"

function readStore(): SavedConsultation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SavedConsultation[]
  } catch {
    return []
  }
}

function writeStore(items: SavedConsultation[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("swasthyasetu:consultations-changed"))
}

export function saveConsultation(c: Omit<SavedConsultation, "id" | "createdAt">): SavedConsultation {
  const item: SavedConsultation = {
    ...c,
    id: `C-${Date.now().toString(36)}`,
    createdAt: Date.now(),
  }
  const all = readStore()
  all.unshift(item)
  writeStore(all)
  persistConsultation(item)
  return item
}

async function persistConsultation(item: SavedConsultation) {
  const row = {
    patient_swasthya_id: item.patientSwasthyaId,
    patient_name: item.patientName,
    date: item.date,
    date_label: item.dateLabel,
    facility: item.facility,
    facility_type: item.facilityType,
    vitals: item.vitals,
    symptoms: item.symptoms,
    notes: item.notes,
    diagnosis: item.diagnosis,
    clinical_notes: item.clinicalNotes,
    recommended_action: item.recommendedAction,
    medications: item.medications,
    risk_level: item.riskLevel,
  }
  const { error } = await supabase.from("consultations").insert(row)
  if (error) console.error("Failed to persist consultation:", error.message)
}

export function listConsultations(patientSwasthyaId?: string): SavedConsultation[] {
  const all = readStore()
  if (patientSwasthyaId) {
    return all.filter(
      (c) =>
        c.patientSwasthyaId.replace(/\s+/g, "").toUpperCase() ===
        patientSwasthyaId.replace(/\s+/g, "").toUpperCase(),
    )
  }
  return all
}

export function clearConsultations() {
  writeStore([])
}

// React hook that subscribes to localStorage + cross-tab changes.
export function useConsultations(patientSwasthyaId?: string) {
  const [items, setItems] = useState<SavedConsultation[]>([])

  useEffect(() => {
    const refresh = () => setItems(listConsultations(patientSwasthyaId))
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("swasthyasetu:consultations-changed", refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("swasthyasetu:consultations-changed", refresh)
    }
  }, [patientSwasthyaId])

  return items
}

// ---- Risk evaluation (prototype thresholds) ----

export interface VitalsRisk {
  level: RiskLevel
  elevated: { label: string; value: string }[]
  message: string | null
}

export function evaluateVitalsRisk(v: ConsultationVitals): VitalsRisk {
  const elevated: { label: string; value: string }[] = []
  let score = 0

  const sys = parseInt(v.bpSystolic, 10)
  const dia = parseInt(v.bpDiastolic, 10)
  if (!isNaN(sys) && !isNaN(dia)) {
    if (sys >= 140 || dia >= 90) {
      score += 2
      elevated.push({ label: "Blood Pressure", value: `${sys}/${dia} mmHg` })
    } else if (sys >= 130 || dia >= 85) {
      score += 1
      elevated.push({ label: "Blood Pressure", value: `${sys}/${dia} mmHg` })
    }
  }

  const hr = parseInt(v.heartRate, 10)
  if (!isNaN(hr)) {
    if (hr >= 110 || hr < 50) {
      score += 2
      elevated.push({ label: "Heart Rate", value: `${hr} bpm` })
    } else if (hr >= 100 || hr < 55) {
      score += 1
      elevated.push({ label: "Heart Rate", value: `${hr} bpm` })
    }
  }

  const temp = parseFloat(v.temperature)
  if (!isNaN(temp)) {
    if (temp >= 100.4) {
      score += 2
      elevated.push({ label: "Temperature", value: `${temp} °F` })
    } else if (temp >= 99.5) {
      score += 1
      elevated.push({ label: "Temperature", value: `${temp} °F` })
    }
  }

  const glucose = parseInt(v.bloodGlucose, 10)
  if (!isNaN(glucose)) {
    if (glucose >= 200) {
      score += 2
      elevated.push({ label: "Blood Glucose", value: `${glucose} mg/dL` })
    } else if (glucose >= 140) {
      score += 1
      elevated.push({ label: "Blood Glucose", value: `${glucose} mg/dL` })
    }
  }

  const spo2 = parseInt(v.oxygenSaturation, 10)
  if (!isNaN(spo2)) {
    if (spo2 < 90) {
      score += 2
      elevated.push({ label: "Oxygen Saturation", value: `${spo2}%` })
    } else if (spo2 < 94) {
      score += 1
      elevated.push({ label: "Oxygen Saturation", value: `${spo2}%` })
    }
  }

  let level: RiskLevel = "stable"
  if (score >= 2) level = "high"
  else if (score === 1) level = "moderate"

  const message =
    level === "high"
      ? "Elevated Risk — Consider Specialist Review"
      : level === "moderate"
        ? "Moderate Risk — Monitor closely"
        : null

  return { level, elevated, message }
}

// ---- Helpers for building a saved consultation ----

export function buildConsultationPayload(input: {
  vitals: ConsultationVitals
  symptoms: string[]
  notes: string
  diagnosis: string
  clinicalNotes: string
  recommendedAction: string
  medications: ConsultationMedication[]
}): Omit<SavedConsultation, "id" | "createdAt"> {
  const now = new Date()
  const dateLabel = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const risk = evaluateVitalsRisk(input.vitals).level
  return {
    patientSwasthyaId: patientProfile.swasthyaId,
    patientName: patientProfile.name,
    date: now.toISOString(),
    dateLabel,
    facility: currentUser.facility,
    facilityType: currentUser.facilityType,
    vitals: input.vitals,
    symptoms: input.symptoms,
    notes: input.notes,
    diagnosis: input.diagnosis,
    clinicalNotes: input.clinicalNotes,
    recommendedAction: input.recommendedAction,
    medications: input.medications,
    riskLevel: risk,
  }
}

// Pending consultation draft persisted while navigating to the referral flow.
const PENDING_KEY = "swasthyasetu:pending-consultation"

export function savePendingConsultation(payload: Omit<SavedConsultation, "id" | "createdAt">) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(payload))
}

export function readPendingConsultation(): Omit<SavedConsultation, "id" | "createdAt"> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as Omit<SavedConsultation, "id" | "createdAt">) : null
  } catch {
    return null
  }
}

export function clearPendingConsultation() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(PENDING_KEY)
}
