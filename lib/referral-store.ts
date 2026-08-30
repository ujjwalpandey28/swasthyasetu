"use client"

// Referral store: types + localStorage persistence + journey stage logic.
// The medical context travels with the referral so the receiving facility
// never needs the patient to repeat their history.

import { useEffect, useState } from "react"

import { currentUser, patientProfile, ReferralPriority } from "@/lib/mock-data"
import {
  ConsultationVitals,
  readPendingConsultation,
  clearPendingConsultation,
  saveConsultation,
} from "@/lib/consultation-store"
import { supabase } from "@/lib/supabase"

export type ReferralStatus =
  | "created"
  | "sent"
  | "accepted"
  | "arrived"
  | "consultation"
  | "follow-up"

export interface ReferralStage {
  key: ReferralStatus
  label: string
  facility: string
  worker: string
  action: string
  timestamp: string | null
  done: boolean
}

export interface ReferralMedicalContext {
  diagnosis: string
  vitalsSummary: string
  medications: string[]
  allergy: string
  testReports: string[]
  referringDoctorNotes: string
}

export interface SavedReferral {
  id: string
  patientName: string
  patientSwasthyaId: string
  patientAge: number
  patientGender: string
  patientBloodGroup: string
  fromFacility: string
  toFacility: string
  specialty: string
  priority: ReferralPriority
  reason: string
  clinicalNotes: string
  treatmentProvided: string
  requiredTests: string
  status: ReferralStatus
  createdAt: number
  createdAtLabel: string
  stages: ReferralStage[]
  medicalContext: ReferralMedicalContext
}

const STORAGE_KEY = "swasthyasetu:referrals"
const DEMO_REFERRAL_ID = "REF-847293"

// ---- Stage definitions ----

export const stageOrder: ReferralStatus[] = [
  "created",
  "sent",
  "accepted",
  "arrived",
  "consultation",
  "follow-up",
]

export const stageLabels: Record<ReferralStatus, string> = {
  created: "Referral Created",
  sent: "Referral Sent",
  accepted: "Referral Accepted",
  arrived: "Patient Arrived",
  consultation: "Specialist Consultation",
  "follow-up": "Follow-Up Scheduled",
}

export const stageFacilities: Record<ReferralStatus, string> = {
  created: "Dhanwantri Nagar Sub-Centre",
  sent: "Dhanwantri Nagar PHC",
  accepted: "District Hospital, Bhilwara",
  arrived: "District Hospital, Bhilwara",
  consultation: "District Hospital — Cardiology",
  "follow-up": "Dhanwantri Nagar PHC",
}

export const stageWorkers: Record<ReferralStatus, string> = {
  created: "Sunita Devi (ANM)",
  sent: "Dr. Ananya Rao",
  accepted: "Dr. Rajesh Menon (Cardiologist)",
  arrived: "Reception — District Hospital",
  consultation: "Dr. Rajesh Menon (Cardiologist)",
  "follow-up": "Dr. Ananya Rao",
}

export const stageActions: Record<ReferralStatus, string> = {
  created: "Referral initiated at sub-centre after routine screening",
  sent: "Referral transmitted to District Hospital with full medical context",
  accepted: "Receiving facility verified identity and accepted the referral",
  arrived: "Patient registered at District Hospital reception",
  consultation: "Specialist evaluation completed; care plan documented",
  "follow-up": "Follow-up scheduled at referring PHC",
}

export const statusBadgeLabels: Record<ReferralStatus, string> = {
  created: "Created",
  sent: "Sent",
  accepted: "Accepted",
  arrived: "Patient Arrived",
  consultation: "In Consultation",
  "follow-up": "Follow-Up Scheduled",
}

// ---- Persistence ----

function readStore(): SavedReferral[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SavedReferral[]
  } catch {
    return []
  }
}

function writeStore(items: SavedReferral[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("swasthyasetu:referrals-changed"))
}

function nowLabel(): string {
  return new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function buildStages(upTo: ReferralStatus): ReferralStage[] {
  const completedIndex = stageOrder.indexOf(upTo)
  const now = nowLabel()
  return stageOrder.map((key, i) => ({
    key,
    label: stageLabels[key],
    facility: stageFacilities[key],
    worker: stageWorkers[key],
    action: stageActions[key],
    timestamp: i <= completedIndex ? now : null,
    done: i <= completedIndex,
  }))
}

function buildMedicalContext(input: {
  diagnosis: string
  clinicalNotes: string
  treatmentProvided: string
  requiredTests: string
  pendingVitals?: ConsultationVitals | null
}): ReferralMedicalContext {
  const p = patientProfile
  const vitals = input.pendingVitals
  const vitalsParts: string[] = []
  if (vitals) {
    if (vitals.bpSystolic && vitals.bpDiastolic)
      vitalsParts.push(`BP ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg`)
    if (vitals.heartRate) vitalsParts.push(`HR ${vitals.heartRate} bpm`)
    if (vitals.temperature) vitalsParts.push(`Temp ${vitals.temperature} °F`)
    if (vitals.bloodGlucose) vitalsParts.push(`Glucose ${vitals.bloodGlucose} mg/dL`)
    if (vitals.oxygenSaturation) vitalsParts.push(`SpO₂ ${vitals.oxygenSaturation}%`)
  }
  const vitalsSummary =
    vitalsParts.length > 0
      ? vitalsParts.join(" · ")
      : p.vitals.map((v) => `${v.label} ${v.value}${v.unit}`).join(" · ")

  return {
    diagnosis: input.diagnosis || "Hypertension under evaluation — cardiac cause to be ruled out",
    vitalsSummary,
    medications: p.currentMedications.map((m) => `${m.name} ${m.dose}`),
    allergy: p.allergies.join(", "),
    testReports: p.diagnostics.map((d) => `${d.name} (${d.date})`),
    referringDoctorNotes:
      input.clinicalNotes ||
      "Chest discomfort over two weeks with elevated BP. Advised salt restriction and home BP monitoring. Continue Amlodipine 5 mg.",
  }
}

export function createReferral(input: {
  toFacility: string
  specialty: string
  priority: ReferralPriority
  reason: string
  clinicalNotes: string
  treatmentProvided: string
  requiredTests: string
}): SavedReferral {
  const pending = readPendingConsultation()
  const p = patientProfile

  const referral: SavedReferral = {
    id: DEMO_REFERRAL_ID,
    patientName: p.name,
    patientSwasthyaId: p.swasthyaId,
    patientAge: p.age,
    patientGender: p.gender,
    patientBloodGroup: p.bloodGroup,
    fromFacility: currentUser.facility,
    toFacility: input.toFacility,
    specialty: input.specialty,
    priority: input.priority,
    reason: input.reason,
    clinicalNotes: input.clinicalNotes,
    treatmentProvided: input.treatmentProvided,
    requiredTests: input.requiredTests,
    status: "accepted",
    createdAt: Date.now(),
    createdAtLabel: nowLabel(),
    stages: buildStages("accepted"),
    medicalContext: buildMedicalContext({
      diagnosis: pending?.diagnosis || "",
      clinicalNotes: input.clinicalNotes,
      treatmentProvided: input.treatmentProvided,
      requiredTests: input.requiredTests,
      pendingVitals: pending?.vitals ?? null,
    }),
  }

  // If there's a pending consultation, save it to the consultation store too.
  if (pending) {
    saveConsultation(pending)
    clearPendingConsultation()
  }

  const all = readStore()
  // Replace any existing demo referral with the same ID
  const filtered = all.filter((r) => r.id !== DEMO_REFERRAL_ID)
  filtered.unshift(referral)
  writeStore(filtered)
  persistReferral(referral)
  return referral
}

async function persistReferral(r: SavedReferral) {
  const row = {
    patient_name: r.patientName,
    patient_swasthya_id: r.patientSwasthyaId,
    patient_age: r.patientAge,
    patient_gender: r.patientGender,
    patient_blood_group: r.patientBloodGroup,
    from_facility: r.fromFacility,
    to_facility: r.toFacility,
    specialty: r.specialty,
    priority: r.priority,
    reason: r.reason,
    clinical_notes: r.clinicalNotes,
    treatment_provided: r.treatmentProvided,
    required_tests: r.requiredTests,
    status: r.status,
    stages: r.stages,
    medical_context: r.medicalContext,
    created_at_label: r.createdAtLabel,
  }
  const { error } = await supabase.from("referrals").insert(row)
  if (error) console.error("Failed to persist referral:", error.message)
}

export function getReferral(id: string): SavedReferral | undefined {
  return readStore().find((r) => r.id === id)
}

export function listReferrals(): SavedReferral[] {
  return readStore()
}

export function updateReferralStatus(
  id: string,
  newStatus: ReferralStatus,
): SavedReferral | undefined {
  const all = readStore()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return undefined
  const referral = all[idx]
  referral.status = newStatus
  referral.stages = buildStages(newStatus)
  all[idx] = referral
  writeStore(all)
  return referral
}

export function clearReferrals() {
  writeStore([])
}

// ---- React hooks ----

export function useReferrals() {
  const [items, setItems] = useState<SavedReferral[]>([])

  useEffect(() => {
    const refresh = () => setItems(listReferrals())
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("swasthyasetu:referrals-changed", refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("swasthyasetu:referrals-changed", refresh)
    }
  }, [])

  return items
}

export function useReferral(id: string | undefined) {
  const [item, setItem] = useState<SavedReferral | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    const refresh = () => setItem(getReferral(id))
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("swasthyasetu:referrals-changed", refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("swasthyasetu:referrals-changed", refresh)
    }
  }, [id])

  return item
}

// ---- Receiving facility options ----

export const receivingFacilityOptions = [
  "District Hospital, Bhilwara",
  "Government Medical College, Udaipur",
  "Community Health Centre, Mandalgarh",
  "Specialist Clinic, Bhilwara",
] as const

export const specialtyOptions = [
  "Cardiology",
  "General Medicine",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Orthopaedics",
] as const

export interface FacilityRecommendation {
  facility: string
  department: string
  available: boolean
  queueEstimate: string
  distance: string
}

export const demoRecommendation: FacilityRecommendation = {
  facility: "District Hospital, Bhilwara",
  department: "Cardiology",
  available: true,
  queueEstimate: "~12 min",
  distance: "8.4 km",
}
